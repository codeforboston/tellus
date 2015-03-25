Tickets = new Mongo.Collection("tickets");

Shared = {
  formatStamp: function(stamp) {
    return moment(stamp).format("h:mma \on ddd MM/DD/YYYY");
  }
};

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.body.helpers({

    feedlist: [
      {
        title: "311",
        id: "311",
        open: [
            {
              name: "Street Flooded with Molasses",
              id: "13123123",
              category: "DPW",
              details: "I awoke early to the sound of my livestock in distress. Rousing myself and making swift egress, I discovered that their movement was impeded by a sweet-tasting viscous substance coating the ground in a blanket nearly a foot in depth--and rising! I implore the authorities to resolve this issue posthaste. If it persists, my business shall suffer most gravely. I will be unable to endow two prestigious universities, and the spacetime continuum will be irreparably torn.",
              stamp: 1425224414893,
              updates: [
                {
                  name: "Issue Acknowledged",
                  stamp: 1425224462189
                },
                {
                  name: "Work Request Issued",
                  stamp: 1425310879224
                }
              ],
              read: false,
              location: {
                name: "Elm Street and Willow"
              },
              requester: {
                fullname: "John Harvard Mit"
              }
            },
            {
              name: "Pothole",
              id: "999999",
              category: "DPW",
              details: "Antelope-sized hole in the ground.",
              updates: [
                {
                  name: "Issue Acknowledged",
                  stamp: 1422032025033
                }
              ]
            }
        ],
        closed: []
      },

      {
        title: "Student Information Services",
        id: "sis",
        open: [

        ],
        closed: [
          {
            name: "Retake Placement Test",
            details: "My horse (Seabiscuit Jones) would like to retake the placement test for 4th grade. He was suffering from a bout of foot and mouth when the previous test was administered, and we believe his performance suffered as a result. We also believe that special consideration should be given to the fact that he can run a 3-minute mile.",
            updates: [
              {
                name: "Issue Received",
                stamp: 1423495996638
              },
              {
                name: "Need More Information",
                details: "Please submit a vet's note confirming that Seabiscuit Jones was ill.",
                resolution_link: "http://sis.somerville.gov/ticketId=13123",
                needs_action: true,
                action_taken: 131232,
                stamp: 1423668874466
              },
              {
                name: "Information Received",
                stamp: 1424273690723
              },
              {
                name: "Issue Resolved",
                details: "We do not admit horses.",
                stamp: 1424878506737
              }
            ]
          }
        ]
      }
    ]
  });

  /* Feed */
  Template.feed.created = (function() {
    this.state = new ReactiveDict();
    this.state.set("selected", "open");
  });

  Template.feed.events({
    'click a.tab': function (event, template) {
      template.state.set("selected", event.target.getAttribute("data-tabname"));
    },

    "click a.collapse": function() {
      Session.set("feed-collapsed-" + this.id, true);
    },

    "click a.expand": function() {
      Session.set("feed-collapsed-" + this.id, false);
    }
  });

  Template.feed.helpers({
    isCollapsed: function() {
      return Session.get("feed-collapsed-" + this.id);
    },

    isTabSelected: function(n) {
      return Template.instance().state.get("selected") == n;
    },

    closedIsSelected: function() {
      return Template.instance().state.get("selected") == "closed";
    },

    openIsSelected: function() {
      return Template.instance().state.get("selected") == "open";
    },

    hasOpenTickets: function() {
      return this.open.length > 0;
    },

    hasClosedTickets: function() {
      return this.closed.length > 0;
    },

    shownTickets: function() {
      var selected = Template.instance().state.get("selected");
      return this[selected];
    }
  });


  // Ticket template:
  Template.ticket.helpers({
    /**
      Does this ticket require user intervention?
    */
    needsAction: function() {
      return false;
    },

    latestUpdate: function() {
      var stamp = this.updates[this.updates.length-1].stamp;
      return moment(stamp).fromNow();
    },

    /**
      Display the ticket details?
    */
    isExpanded: function() {
      return Template.instance().state.get("expanded");
    },

    requestDate: function() {
      return Shared.formatStamp(this.stamp);
    }
  });

  Template.ticket.created = (function() {
    this.state = new ReactiveDict();
    this.state.set("expanded", false);
  });

  Template.ticket.events({
    "click a.ticket-name": function(event, template) {
      template.state.set("expanded", !template.state.get("expanded"));
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Tickets.remove({});

  });
}
