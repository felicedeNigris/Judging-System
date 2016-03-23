Meteor.startup(function(){
  // process.env.MAIL_URL="smtp://felideni%40gmail.com:RZsDxJEZJyAp7kE3@smtp.gmail.com:465/";
  process.env.MAIL_URL="smtp://postmaster%40sandboxcb135e4a800843b59c23cbc56e2a67fc.mailgun.org:message@smtp.mailgun.org:587";
})



// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check(to, String);
    check(from, String);
    check(subject, String);
    check(text, String);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }
});
