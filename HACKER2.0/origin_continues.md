 # [Update] I found a CVSS 10.0 in Stripe. HackerOne blocked me from reporting it for 5 days. Then it got worse.
Bug Bounty Drama
reddit.com

Three months ago I posted here about finding an unauthenticated OAuth registration vulnerability in Stripe's infrastructure. That post hit 70k+ views. A lot of you asked for updates. Here's what happened next.

Spoiler: it's somehow dumber than you'd think.

TL;DR: Found Critical Stripe OAuth bug → HackerOne blocked submission for 5 days → Had to bypass platform via Twitter → Stripe patched in 12 hours → Bounty denied as "duplicate" → Reported the platform failure to HackerOne → Closed in 40 minutes → Circular resolution trap → Mediation: 63 days, zero response.
The Bug (Quick Recap)

Found access.stripe.com/mcp/oauth2/register — completely unauthenticated endpoint that handed out OAuth clients with the privileged mcp scope. No API key. No developer verification. Just POST a JSON body and get back a working client_id that could authorize full merchant account takeover.

Attack chain: Register client → craft authorization URL → victim merchant clicks "Authorize" on what looks like an official Stripe integration (because it IS served from access.stripe.com) → exfiltrate auth code → exchange for admin token → game over. Treasury transfers, virtual card creation, Connect platform control, persistent webhooks that survive token revocation.

CVSS 10.0. Full PoC with video. Tested in my own sandbox.
The 5-Day Blockade

March 15, 2026: Found it. Built the PoC. Ready to report.

March 15-20: HackerOne's platform blocked my submission. Reason? A -5 reputation penalty from an unrelated program (Meesho marked a different report N/A, triggering "trial report" restrictions).

I filed support ticket #645235: "URGENT: Critical ATO Vulnerability in Stripe — Submission Blocked by Platform Restriction"

Their response: "No manual override possible. Wait for automatic reset."

The ticket auto-closed as a "feature request" within an hour. When I replied, the email bounced back: "This address no longer accepts requests."

During those 5 days, Stripe's endpoint was live and exploitable.
The Bypass

March 20: Exhausted every HackerOne channel. Did the only thing left — contacted Stripe Security directly on Twitter. Explained I had a Critical unauthenticated endpoint, withheld the PoC until we had a secure channel.

Stripe Security's response: They contacted HackerOne and forced them to lift my submission restriction.

Email from Sholihin Kamarudin (security@stripe.com): "We worked with HackerOne to remove the submission limitation on your account."

Think about that. Stripe Security had to bypass HackerOne to let me report a vulnerability to Stripe via HackerOne.
The Fix

March 20, 23:06 UTC: Report #3619019 finally submitted. Full PoC, curl commands, 4 screenshots, screen recording, impact analysis.

March 21, ~22:56 AEST: Email from Stripe Support (Agent Divine): "Our security team has confirmed that the issue is now fully resolved. We really appreciate you bringing this to our attention."

They patched it in ~12 hours. On a Sunday.
The Denial

March 23: HackerOne marks the report "Duplicate" of report #3597174.

That report? Submitted March 10. Marked Informative. Bounty: $0.

So let me get this straight:

    March 10: Someone reports it → sits for 11 days → marked Informative, no bounty

    March 20: I report it → Stripe patches in 12 hours on a Sunday

    March 23: HackerOne says mine is a duplicate of the one that got zero response for 11 days

March 25: Stripe Security comments: "This is intended behavior."

Four days after their own Support team confirmed it was "verified and fully resolved."
The Smoking Gun

March 26: I checked the original webhook.site redirect URI I used in the PoC. The one that worked perfectly during testing.

Now? error: invalid_redirect_uri — "Not registered redirect_uri"

They added redirect_uri validation after my disclosure.

So it was "intended behavior" that also required a security patch deployed post-disclosure? Make it make sense.
The $25k Question

March 25, 15:49 UTC: Stripe denies my bounty citing "intended behavior."

March 24, 23:40 GMT: Stripe pays researcher @rcss $25,000 for a different report.

Same program. Same day. One researcher gets $25k. I get "intended behavior."
The Meta-Report

At this point I'm thinking: okay, this is fucked, but at least I can report the platform failure to HackerOne. The 5-day blockade that left a CVSS 10.0 endpoint exploitable while their submission restrictions prevented disclosure.

May 19, 2026: Submit report #3743325 documenting the platform security issue.

40 minutes later: Closed as "Informative." Severity downgraded from High to Low (CVSS 2.3).

Their reasoning: "The downstream impact on third-party vulnerability disclosure timelines is indirect and not part of HackerOne's system CIA assessment."

Let me translate: A vulnerability disclosure platform blocking disclosures to other companies isn't a HackerOne security issue.

Then they added: "For reporting functional bugs, please submit at https://support.hackerone.com/support/home instead."
The Perfect Circle

Alright. Fine. I'll file a support ticket like they asked, because all of my previous tickets were so successful.

Support ticket filed: Same issue. Submission restrictions blocked a Critical disclosure. Support auto-closed the original ticket. No manual override exists.

Support response (~1 hour later): "If you disagree with any report's decision, you can consider following up with the team in the report comments."

The problem: Comments are disabled on Informative reports unless you have >3000 reputation and signal >3.

My reputation: Blocked by the same submission restrictions that caused this whole mess.

Step 1: Report blocked → told to file support ticket
Step 2: Support ticket → told to comment on report
Step 3: Comments disabled unless >3000 rep
Step 4: Can't get >3000 rep because submissions are blocked
Step 5: Back to Step 1

I reported a circular trap. They responded by creating a circular trap.
The Mediation Request

May 20, 2026, 12:25am UTC — 63 days after the original report: Filed formal mediation request.

Cited:

    Timeline impossibility (duplicate sat 11 days untriaged, my report triggered 12-hour Sunday fix)

    Contradictory statements (Support confirmed fix, Security claimed "intended behavior")

    Post-disclosure hardening (redirect_uri restriction proves remediation)

    Discriminatory payment ($25k to competitor same day, denied mine 15 hours later)

Response as of May 23: Zero. Not even an automated acknowledgment.

Total comments on report #3619019 across 63+ days: 2

    HackerOne: "Duplicate"

    Stripe: "Intended behavior"

That's it.
The Pattern

Let me lay out every communication attempt:

What I sent:

    Detailed vulnerability report (PoC, video, timeline, impact analysis)

    Multiple status requests via comments (blocked after new policy)

    2 HackerOne support tickets (auto-closed or redirected)

    1 formal legal demand to Stripe — 30+ opens via email tracking, no response

    1 final notice to Stripe — 23+ opens, forwarded to external legal counsel, no response

    1 meta-report about platform failure (closed in 40 minutes)

    1 support ticket about platform failure (redirected to disabled comments)

    1 official mediation request (zero response)

What I got back:

    1 comment: "Duplicate"

    1 comment: "Intended behavior"

Responses addressing technical evidence: 0
Responses to legal demands: 0
Responses to mediation: 0
Why This Matters

This isn't about one bounty. It's about what happens when platform economics prioritize denial over disclosure.

HackerOne's submission restrictions left a CVSS 10.0 endpoint exploitable for 5 extra days. During that window, any attacker could have registered malicious OAuth clients and started collecting merchant authorization codes.

When I reported this platform failure, their response was: blocking disclosures to third parties isn't our security problem.

Then they created a resolution system where:

    Bug reports get closed → told to file support tickets

    Support tickets → told to comment on reports

    Comments disabled based on reputation

    Reputation can't be gained because submissions are blocked

Every pathway either auto-closes, redirects in a circle, or goes silent.
The Documentation

I documented every single step. Timestamps, screenshots, emails, server logs. It's all public:

https://securityallround.com/HACKER2.0/origin.html

Including:

    Full Stripe OAuth PoC (attack chain with curl commands)

    HackerOne support tickets showing the 5-day blockade

    Email from Stripe Security forcing HackerOne to lift the restriction

    Stripe Support confirming the fix in 12 hours

    Post-disclosure redirect_uri hardening that proves it wasn't "intended"

    Meta-report closure + support ticket runaround

    Mediation request (currently: 3 days, zero response)

    Both illustrated and technical diagrams of the circular trap

Everything. Receipts for days.


Need a HACKER2.0 — because this shit shouldn't be possible.

Core principles:

    Escrow-backed bounties: Funds locked at submission, released when criteria met

    Automated silent-patch detection: If the bug gets fixed, researcher gets paid (can't claim "intended behavior" after deploying a patch)

    Binding arbitration: Reports can't be closed without payment until disputed claims are independently resolved

    No reputation system that blocks time-sensitive disclosures

Not because I'm bitter. Because platform economics create predictable failure modes, and those can be engineered out.
The Question

If a vulnerability disclosure platform can block a CVSS 10.0 disclosure for 5 days, force the researcher to bypass the platform entirely via Twitter, then close a report about that blockade as "not our problem" while creating circular resolution paths...

What exactly is the platform protecting?

Full timeline with evidence: https://securityallround.com/HACKER2.0/origin.html

Previous post: https://www.reddit.com/r/bugbounty/comments/1s8gjmp/hackerone_automation_blocked_my_critical_100/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

I'll update this if/when mediation responds. But after 63 days of pattern-matched silence, I'm not holding my breath.

EDIT (for those asking about next steps): Filed mediation May 20. HackerOne's policy says 10 business days typical response time. If nothing by end of month, proceeding with Australian Consumer Law complaint against Stripe Payments Australia Pty Ltd and potentially QCAT filing. Every resolution pathway has been attempted. Every one has failed or gone silent. The paper trail is complete.
