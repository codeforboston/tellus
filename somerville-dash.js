var Tickets = new Mongo.Collection("tickets");

var StatusCodes = {
    PENDING: 0,
    BEGUN: 1,
    STOPPED: 2,
    COMPLETE: 3
};

var StatusNames = {
    0: "pending",
    1: "begun",
    2: "stopped",
    3: "complete"
};

var Shared = {
    formatStamp: function(stamp) {
        return moment(stamp).format("h:mma \on ddd MM/DD/YYYY");
    }
};

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.body.helpers({
        // This feedlist is meant to represent a 'fully inflated'
        // version of a ticket feed. We'll need to break this down into
        // collections when we begin implementing persistence/the server
        // side.
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

                        /* Use to indicate that multiple tickets refer to the
                         * same issue. May be some way to show aggregate
                         * statistics about the ticket group.
                                         */
                        group: 771,
                        updates: [
                            {
                                name: "Issue Acknowledged",
                                stamp: 1425224462189,
                                status_code: StatusCodes.COMPLETE,
                                tag: "acknowledgement",
                                notes: "It should be possible to attach notes to any stage of the pipeline."
                            },
                            {
                                name: "Work Request Issued",
                                stamp: 1425310879224,
                                status_code: StatusCodes.COMPLETE
                            },
                            {
                                name: "Work Begun",
                                status_code: StatusCodes.BEGUN,

                                // The stage group could be used to
                                // aggregate data about a particular
                                // pipeline stage. In particular, it
                                // could include information about the
                                // arithmetic mean and distribution for
                                // the completion time.
                                stage_group: 889,

                                // Provide a full log of the significant
                                // property changes for each stage.
                                updates: [
                                    {stamp: 1425310880000,
                                     changed: {prop: "status_code",
                                               from: StatusCodes.PENDING,
                                               to: StatusCodes.BEGUN}}
                                ]
                            },
                            {
                                name: "Work Complete",
                                status_code: StatusCodes.PENDING,
                                tag: "complete"
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
                                stamp: 1422032025033,
                                status_code: StatusCodes.COMPLETE
                            },
                            {
                                name: "Work Order Issued",
                                status_code: StatusCodes.BEGUN,
                            },
                            {
                                name: "Job Complete",
                                notes: "Slightly deceptive description. Pothole was the size of a dik-dik."}
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
                        stages: [

                        ],
                        updates: [
                            {
                                name: "Issue Received",
                                stamp: 1423495996638
                            },
                            {
                                name: "Need More Information",
                                notes: "Please submit a vet's note confirming that Seabiscuit Jones was ill.",
                                // A link to a website where the user
                                // can resolve the issue.
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
                                stamp: 1424878506737,
                                attachments: [
                                    // List of associated documents
                                ]
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


    Template.pipeline_sm.helpers({
        status_name: function() {
            return StatusNames[this.status_code];
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        Tickets.remove({});

    });
}
