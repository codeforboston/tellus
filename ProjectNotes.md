# t311

## Ticket Structure

### Requirements
- Indicate if a ticket requires user attention
  - Support for attachments, e.g., PDF forms
  - Include links, if the task can be completed online
- Progress may not always be linear (though I *think* the linear case predominates, and we should design with it foremost in mind).

### Non-Linear Tickets
- Multiple stages of a ticket may be in progress simultaneously. The default representation for this should be as succinct as possible. I.e., it should show a linear segmented progress bar, with each segment corresponding to a stage in the ticket pipeline. Each segment should be visually coded to represent progress (e.g., color).
- There could also be an expanded view that shows a chronological visualization of the ticket history. I imagine this as stacked bars on a timeline.

### Knowing the Pipeline Structure in Advance
- Allow ticket publishers to describe a ticket's pipeline separately.
  - It should be possible to provide the pipeline for a ticket separately or as part of a ticket update.
  - As long as there's a unique ticket id (unique within the scope of a particular )
- If there's a class of tickets that shares the same pipeline structure, it should be possible to publish that structure independent of any particular ticket. They shou

## Progress Indicator

### The Problem
- The ideal is to present a precise timeline of the remaining steps and how long each will take to complete.
- The ideal is probably unreachable for most classes of tickets, and we should design according to the expectation that it is unreachable.

### Things we should be able to report
- How long similar classes of ticket took to complete (total duration)
- How long each stage of a ticket pipeline took to complete (segment duration)
- The distribution of completion times for each ticket class and ticket stage class.
  - Could show a nice, small visualization (sparkline style) on click, tap, or hover.
- An estimate (*clearly marked as such*) of how long this particular ticket will take and how long each pipeline stage will take.

### Presentation
- It should be clear in advance that the progress indicator is not a promise of a particular timeline.
- I imagine a segmented
- Ideally, we would scale the pipeline
- We should still have a progress indicator, though!
