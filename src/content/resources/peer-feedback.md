# Delivering Constructive Peer Feedback

**Target Audience:** Professionals who need to give feedback to colleagues, peers, or team members in a way that is honest, useful, and does not damage the working relationship.

---

## The SBI Model

SBI stands for Situation, Behavior, Impact. It is the most reliable framework for delivering difficult feedback because it grounds the conversation in observable facts rather than interpretations or character judgments.

The three components work as follows.

**Situation** names the specific context where the behavior occurred. Not "recently" or "sometimes." A specific meeting, a specific project, a specific conversation. The situation anchors the feedback to something concrete that both parties can refer to.

**Behavior** describes what you observed, not what you concluded from it. "You interrupted me three times during the design review" is a behavior. "You are dismissive of junior engineers" is an interpretation. The behavior is observable and specific. The interpretation is arguable and often triggers defensiveness.

**Impact** states the concrete effect of the behavior on you, the team, or the work. "When my points were interrupted, I was not able to finish explaining the tradeoff, and the decision was made without that information" is an impact. That is more actionable and more credible than a purely emotional response.

**A full SBI example:**

> "In the project kickoff on Tuesday [Situation], you presented the technical approach as already decided before the team had the chance to weigh in [Behavior]. As a result, two concerns from the mobile team did not get addressed until two days later, which delayed the start of their work [Impact]."

This delivery is factual. There is no character attack. There is no escalation. It gives the recipient something specific to respond to and something specific to change. Both of those things are necessary for feedback to actually work.

## Praising in Public, Critiquing in Private

The psychological safety rule for all feedback is straightforward: positive feedback should be shared publicly when possible. Corrective feedback should never be shared in a group setting.

In code review, design critique, and team retrospectives, this distinction matters practically.

**In code review:** If a contributor made a mistake that others would benefit from understanding, address it in the PR comment but frame it as educational rather than corrective. "This pattern has a thread-safety issue in concurrent environments. Here is an alternative approach: [example]." For feedback about someone's overall approach, habits, or judgment, take it to a private message or a 1:1, not a PR thread.

**In design critique:** Critique the design, not the designer. "This flow has an extra step that creates friction for first-time users" is critique of the work. "You always overcomplicate the flows" is critique of the person. The first improves the product. The second damages the relationship and produces defensiveness in future reviews.

**In retrospectives:** Retrospectives require explicit facilitation norms. At the start of every retrospective, state that the goal is to discuss systems and processes, not evaluate individuals. If someone names a colleague in a negative way, redirect immediately: "Let us talk about what in our process contributed to the timeline, rather than individual contributions."

## Addressing Microaggressions

Subtle exclusion, dismissive body language, having your ideas routinely attributed to someone else, being spoken over consistently: these patterns are real, they accumulate over time, and they are best addressed directly and early rather than allowed to compound.

The direct address approach is most effective when done as close to the incident as possible, in private, and without accusation.

**When a peer dismisses your point in a meeting, and then someone else makes the same point and receives credit:**

Address it in a private message after the meeting:

> "I wanted to mention something from the meeting today. I raised [specific point] and it did not seem to land, but when [other person] said something similar a few minutes later, it got traction. I do not know if that is coincidence, but it has happened a few times and I wanted to name it directly. I am not assuming intent. I just wanted to flag it so you are aware."

This message is non-accusatory, specific, and private. It gives the other person the benefit of the doubt while making clear that you have noticed a pattern.

**If the pattern continues after a direct address:**

Document the incidents (date, what was said, who was present) and bring them to your manager. Frame it factually: "I have had three instances in the past month where [behavior], and I addressed it directly with [colleague] two weeks ago. I am bringing it to you because it is continuing and I want your advice on how to handle it."

## Receiving Defensive Reactions

When someone reacts defensively to feedback, the instinct is to either back down ("Oh no, I did not mean it like that, forget I said anything") or to escalate the confrontation. Both options make the situation worse.

The goal when you receive a defensive reaction is to slow the conversation down without retreating from the substance of the feedback.

**Script for de-escalating a defensive reaction:**

> "I can see this is landing in a way I did not intend. I am not trying to attack you. I want to flag something I observed because I think it is affecting the work, and because I respect our working relationship enough to say it directly. Can we take a moment and start over?"

Then restate the SBI feedback more slowly, with even more emphasis on the specific situation and behavior rather than the impact.

If the person remains defensive or escalates, end the conversation cleanly:

> "I can tell this is not a good time to have this conversation. I am going to leave it here for now. I hope we can revisit it when things are calmer."

Do not issue ultimatums. Do not involve others in the moment. Do not continue arguing with someone in an emotionally activated state. The feedback has been delivered. It is now their process to work through. Give it time, and revisit it if the behavior continues.
