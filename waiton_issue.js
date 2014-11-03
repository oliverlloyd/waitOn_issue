Router.route('/login', function () {
  this.render('login');
});

var mustBeSignedIn = function() {
  console.log('mustBeSignedIn onBeforeAction function')
  if (!(Meteor.user() || Meteor.loggingIn())) {
    console.log('User not logged in, redirecting to login')
    this.redirect('login');
  } else {
    this.next();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['login']});


Router.route('/private', {
  waitOn: function () {
    console.log('This is the waitOn function for the /private route')
    return Meteor.subscribe('post');
  },

  action: function () {
    if (this.ready())
      // if the sub handle returned from waitOn ready() method returns
      // true then we're ready to go ahead and render the page.
      this.render('private')
    else
      // otherwise render the loading template.
      this.render('Loading');
  }
});

if (Meteor.isServer) {
  Meteor.publish('post', function () {
    var self = this;
    // send the ready message in a few seconds
    console.log('We\'ve been asked to publish some documents, we\'re doing so')
    setTimeout(function () {
      self.ready();
    }, 2000);
  });
}