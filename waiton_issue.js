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

Posts = new Meteor.Collection('posts');

if (Meteor.isServer) {
  Meteor.publish('post', function () {
    var self = this;
    // send the ready message in a few seconds
    console.log('We\'ve been asked to publish some documents, we\'re doing so');

    // Insert a doc
    Posts.insert({'foo': 'bar'})

    setTimeout(function () {
      self.ready();
      // Ideally, we'd restrict this content to logged in users but we might wrongly think we've
      //  already done this using the onBeforeAction function
      return Posts.find();
    }, 2000);
  });
}