Meteor.startup(function(){
  process.env.MAIL_URL="smtp://postmaster%40sandboxcb135e4a800843b59c23cbc56e2a67fc.mailgun.org:message@smtp.mailgun.org:587";

  Accounts.emailTemplates.from="no-reply@ujudge.meteor.com";
  Accounts.emailTemplates.sitename= "UJudge";
  Accounts.emailTemplates.verifyEmail.text = function(user,url){
    return "Welcome to UJudge " + user.username + " !\n" +  " To activate your Account, simply click the link below:\n\n" + url;
  };
  Accounts.emailTemplates.verifyEmail.subject = function(user){
    return "Verify your email for UJudge.";
  };
  Accounts.config({
    sendVerificationEmail: true
  });
  // Accounts.sendResetPasswordEmail(user.id)
});



// In your server code: define a method that the client can call
// Meteor.methods({
//   sendEmail: function (to, from, subject, text) {
//     check(to, String);
//     check(from, String);
//     check(subject, String);
//     check(text, String);
//
//     // Let other method calls from the same client start running,
//     // without waiting for the email sending to complete.
//     this.unblock();
//
//     Email.send({
//       to: to,
//       from: from,
//       subject: subject,
//       text: text
//     });
//   }
// });

// Meteor.methods({
//   sendResetPass: function(userId, email){
//     check(userId,String);
//     check(email,String);
//     Accounts.sendResetPasswordEmail(userId)
//   }
// })
