angular.module('judging-system').controller('AdminConsoleCtrl', function ($scope, $interval, $meteor, TimeFactory) {
	var index;

	var emptyEvent = {
		_id: "empty",
		name: "No events created",
		roundTime: 0,
		currentRound: "--",
		inGame: false
	};

	function getTotalScore() {
		var playerScores = $scope.$meteorCollection(function() {
			return Scores.find({eventId:$scope.event._id, playerId: $scope.event.currentPlayerId});
		});
		$scope.totalScore = 0;
		for(var i=0; i<playerScores.length; i++) {
			$scope.totalScore += playerScores[i].score;
		}
		var tempPlayers = $scope.event.players;
		for(var i=0; i<tempPlayers.length; i++) {
			if(tempPlayers[i].id===$scope.event.currentPlayerId){
				tempPlayers[i].totalScore = $scope.totalScore;
			}
		}
		//Sorts the order of scores for the leaderboard. Needs changes so that it does not affect player order in the collection
		// tempPlayers = tempPlayers.sort(function(a,b){
		// 	return b.totalScore-a.totalScore;
		// });
		Events.update($scope.event._id ,{$set:{players: tempPlayers}});
	};
	
	//Initialize variables in a function so that info is not reset on view change
	initializeVar();

	function startMyTimer() {
		theTimer = $interval(timerCallback,1000,0);
		function timerCallback() {
			$scope.roundTime = TimeFactory.getCurrentTime();
	    	Events.update($scope.event._id, {$set: {currentTime: TimeFactory.getCurrentTime() }});
	        if ($scope.roundTime <= 0) {
	        	$scope.stopButton = false;
	        	TimeFactory.cancelTheTimer();
		        $interval.cancel(theTimer);
		        $scope.roundTime = 0;
		    }
		}  
	};

	function initializeVar(eventId) {
		window.scope = $scope;
		$scope.events = Events.find({}, {sort: {createdAt: -1}}).fetch();
		$scope.myEvents = Events.find({author:Accounts.userId()}).fetch();
		if($scope.myEvents.length > 0){
			$scope.event = eventId === undefined ? $scope.myEvents[0] : Events.findOne({_id: eventId});
		}
		if($scope.event === undefined) $scope.event = emptyEvent;
		$scope.endButton = true;
		//$scope.eventId = {id: $scope.event._id, name: $scope.event.name};
		$scope.scores = $scope.$meteorCollection(function() {
	        // console.log($scope.event);
	        if(($scope.event !== null) && ($scope.event !== undefined)) {
		        return Scores.find({eventId:$scope.event._id, playerId: $scope.event.currentPlayerId, round: $scope.event.currentRound});
		    }else {
		    	return Scores.find({eventId:"none"});
		    }
		});
		if (!$scope.event.inGame && $scope.event._id !== "empty") {
			index = 0;
			$scope.totalScore = 0;
		  	$scope.roundTime = $scope.event.timeLimit;
		  	TimeFactory.setCurrentTime($scope.event.timeLimit);
		  	$scope.startButton = true;
		  	$scope.stopButton = false;
		  	$scope.nextPlayerButton = true;
		  	$scope.nextRoundButton = false;
		  	$scope.event.currentPlayerId = $scope.event.players[0].id;
		  	$scope.event.currentRound = 1;
		  	Events.update($scope.event._id, {$set: {currentPlayerId: $scope.event.currentPlayerId }});
		  	Events.update($scope.event._id, {$set: {currentRound: $scope.event.currentRound }});
		}
		else if($scope.event.inGame){
			getTotalScore();
			for(var i in $scope.event.players){
				if($scope.event.players[i].id === $scope.event.currentPlayerId){ index = Number(i) };
			}
			$scope.roundTime = TimeFactory.getCurrentTime();
			if($scope.roundTime===$scope.event.timeLimit){
				$scope.startButton = true;
		  		$scope.stopButton = false;
		  	}
		  	else if ($scope.roundTime <= 0) {
		  		$scope.startButton = false;
		  		$scope.stopButton = false;
		  	}
		  	else{
		  		$scope.startButton = false;
		  		$scope.stopButton = true;
		  	}
		  	if(index + 1 === $scope.event.players.length && $scope.event.currentRound === $scope.event.rounds) {
				$scope.nextRoundButton = false;
				$scope.nextPlayerButton = false;
			}
			else if((index + 1) === $scope.event.players.length) {
				$scope.nextRoundButton = true;
				$scope.nextPlayerButton=false;
			}
			else {
				$scope.nextPlayerButton = true;
				$scope.nextRoundButton = false;
			}
			startMyTimer();
		}
		else{
			$scope.roundTime = 0;
		} 
	};

	//Refresh admin console when new event is seleted
	$scope.updateEventDetails = function(myEventId) {
		Events.update(myEventId, {$set: {inGame: false}});
		initializeVar(myEventId);
	};

	$scope.updateScores = function() {
		$scope.scores = $scope.$meteorCollection(function() {
	        return Scores.find({eventId:$scope.event._id, playerId: $scope.event.currentPlayerId, round: $scope.event.currentRound});
	    });
	};

	$scope.getRoundTotal = function() {
	    var total = 0;
	    angular.forEach($scope.event.judges, function(judge) {
		    var score = $scope.scores.find(function(score) { 
		    	return judge.id === score.judgeId; 
		    });
		    if (score === undefined) return;
	        total += score.score;
	    });
	    return total;
	};

	$scope.getJudge = function(score) {
		return $scope.event.judges.find(function(judge){return judge.id === score.judgeId;});
	};

	$scope.getPlayerName = function() {
		if($scope.event._id === "empty" ) return $scope.event.name;
		return $scope.event.players.find(function(player){return player.id === $scope.event.currentPlayerId;}).name;
	};

	$scope.startTimer = function() {
		TimeFactory.startTheTimer();
        startMyTimer();
	}; 

	$scope.startPlayer = function() {
		if ($scope.event.players[0].id === "player1" && $scope.event.currentRound === 1) {
			Events.update(scope.event._id, {$set: {inGame: true}});
			var allEvents = Events.find({}).fetch();
			for(var i in allEvents) {
				if(allEvents[i]._id !== $scope.event._id) {
					Events.update(allEvents[i]._id, {$set: {inGame: false}});
				}
			}
			
		}
		getTotalScore();
		$scope.startTimer();
		$scope.startButton = false;
		$scope.stopButton = true;
	};

	$scope.endPlayer = function() {
		TimeFactory.cancelTheTimer();
		$scope.roundTime = 0;
		getTotalScore();
		TimeFactory.setCurrentTime($scope.roundTime);
		Events.update($scope.event._id, {$set: {currentTime: TimeFactory.getCurrentTime()}});
		$scope.stopButton = false;
	};

	$scope.nextPlayer = function() {
		index++;
		$scope.event.currentPlayerId = $scope.event.players[index].id;
		$scope.roundTime = $scope.event.timeLimit;
		getTotalScore();
		TimeFactory.setCurrentTime($scope.roundTime);
		Events.update($scope.event._id, {$set: {currentTime: TimeFactory.getCurrentTime() }});
		Events.update($scope.event._id, {$set: {currentPlayerId: scope.event.currentPlayerId }});
		$scope.updateScores();
		if(index + 1 === $scope.event.players.length) {
			if( $scope.event.currentRound === $scope.event.rounds) {
				$scope.nextRoundButton = false;
				$scope.nextPlayerButton = false;
			}
			else {
				$scope.nextPlayerButton = false;
				$scope.nextRoundButton = true;
				$scope.startButton = true;
			}
		}
		else {
			$scope.startButton = true;
		}
	};

	$scope.nextRound = function() {
		$scope.event.currentRound++;
		Events.update(scope.event._id, {$set: {currentRound: scope.event.currentRound }});
		$scope.roundTime = $scope.event.timeLimit;
		TimeFactory.setCurrentTime($scope.roundTime);
		Events.update($scope.event._id, {$set: {currentTime: TimeFactory.getCurrentTime() }});
		$scope.event.currentPlayerId = $scope.event.players[0].id;
		getTotalScore();
		Events.update(scope.event._id, {$set: {currentPlayerId: scope.event.currentPlayerId }});
		$scope.updateScores();
		index=0;
		if(index + 1 === $scope.event.players.length && $scope.event.currentRound === $scope.event.rounds) {
			$scope.nextRoundButton = false;
			$scope.nextPlayerButton = false;
		}
		else {
			$scope.startButton = true;
			$scope.nextPlayerButton = true;
			$scope.nextRoundButton = false;
		}
	};
	
	$scope.endGame = function() {
		TimeFactory.cancelTheTimer();
		$scope.roundTime = 0;
		TimeFactory.setCurrentTime($scope.roundTime);
		getTotalScore();
		Events.update(scope.event._id, {$set: {inGame: false }});
		$scope.nextRoundButton = false;
		$scope.nextPlayerButton = false;
		$scope.startButton = false;
		$scope.stopButton = false;
		$scope.endButton = false;
	};
});