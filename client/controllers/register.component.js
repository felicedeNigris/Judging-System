
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

      // Accounts.forgotPassword($scope.credentials, (err) => {
      //     if (err) {
      //       Bert.alert("" + err, 'danger', 'fixed-top');
      //     }
      //   });

      $scope.register = () => {

        Accounts.createUser($scope.credentials, (err) => {
          if (err) {
            $scope.error = err;
            console.log(err);
          }
          // else{
          //   Meteor.call(
          //     'sendEmail',
          //     'felideni@gmail.com',
          //     $scope.credentials.email,
          //     'Hello from Meteor!',
          //     'This is a test of Email.send.'
          //   );
          // }
        });

      };
    }

  };
});
