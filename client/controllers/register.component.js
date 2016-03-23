
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

angular.module("judging-system").directive('register', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/views/components/register.ng.html',
    controllerAs: 'register',
    controller: function ($scope, $state) {

      $scope.credentials = {
        username: '',
        email: '',
        password: ''
      };

      $scope.error = '';



      $scope.register = () => {

        Accounts.createUser($scope.credentials, (err) => {
          if (err) {
            $scope.error = err;
            console.log(err);
          }

        });

      }; //end register

      $scope.forgot = {};
      $scope.forgot.email = '';
      $scope.resetPassword = ()=>{
        Accounts.forgotPassword($scope.forgot, function(err){
          if(err){
            console.log('Sorry, something went wrong.')
          }else{
            alert('Check your mailbox!')
          }
        });
      };//end reset password
    }//end controller

  };//end return
});

// Accounts.sendResetPasswordEmail($scope.resetEmail,function(err){
//   if(err){
//     if(err.message === 'User not found [403]'){
//       alert('Error, the email does not exist')
//     }else{
//       alert("We're sorry, something went wrong.")
//     }
//   }else{
//     alert('Email Sent. Check you mailbox.')
//   }
// })


// Accounts.forgotPassword($scope.credentials, (err) => {
//     if (err) {
//       Bert.alert("" + err, 'danger', 'fixed-top');
//     }
//   });

// else{
//   Meteor.call(
//     'sendEmail',
//     'felideni@gmail.com',
//     $scope.credentials.email,
//     'Hello from Meteor!',
//     'This is a test of Email.send.'
//   );
// }
