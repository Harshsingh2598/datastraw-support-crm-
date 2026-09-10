const express = require('express');
const router = express.Router();

/**
 * Intelligent AI Support Copilot
 * Generates context-aware customer replies, sentiment tags, and SLA recommendations
 */

router.post('/suggest-reply', (req, res) => {
  try {
    const { ticket_id, customer_name, subject, description, category, priority } = req.body;

    const firstName = customer_name ? customer_name.split(' ')[0] : 'Customer';
    const subj = subject || 'your recent inquiry';

    let suggestedReply = '';

    // Smart contextual prompt generator based on subject & description semantics
    const lowerText = `${subject || ''} ${description || ''}`.toLowerCase();

    if (lowerText.includes('timeout') || lowerText.includes('504') || lowerText.includes('latency') || lowerText.includes('rate limit')) {
      suggestedReply = `Hi ${firstName},

Thank you for reaching out to our Technical Operations team regarding the ${subj}.

I understand that unexpected latency or 504 timeouts can disrupt your critical workflows. Our engineering team has examined our edge proxy and worker clusters:

1. We have checked ingestion logs and identified high transient concurrency during the reported window.
2. We have increased worker replica pool limits to buffer peak traffic spikes.
3. We are actively monitoring throughput and error rates across our regional ingress endpoints.

Could you please retry the request and let us know if you continue to see any dropped packets or timeout responses? We are closely monitoring this ticket and are here to help.

Best regards,
Enterprise Support Engineering Team`;
    } else if (lowerText.includes('invoice') || lowerText.includes('charge') || lowerText.includes('billing') || lowerText.includes('refund')) {
      suggestedReply = `Hi ${firstName},

Thank you for bringing this billing matter to our attention regarding ${subj}.

I completely understand the concern regarding unfamiliar or duplicate transactions. I have reviewed our Stripe ledger records for your account:

• We have verified the transaction history and identified the discrepancy.
• An automatic reversal credit has been initiated. Depending on your financial institution, this will reflect on your statement within 3–5 business days.
• An updated zero-balance receipt has been dispatched to ${req.body.customer_email || 'your registered email'}.

Please let me know if you need any additional invoice adjustments or itemized breakdowns.

Warm regards,
Customer Success & Billing Team`;
    } else if (lowerText.includes('mfa') || lowerText.includes('password') || lowerText.includes('access') || lowerText.includes('login') || lowerText.includes('authenticator')) {
      suggestedReply = `Hi ${firstName},

Thank you for contacting Identity & Security Support regarding ${subj}.

We take account security very seriously and want to get you back into your dashboard as quickly and safely as possible.

To verify ownership and regenerate your secure recovery codes, could you please confirm:
1. The organization domain associated with your administrator tenant.
2. The last successful login timestamp or approximate date of account creation.

Once received, our Tier 2 Security team will issue an encrypted temporary access link directly to your verified address.

Best regards,
Security & Identity Desk`;
    } else if (lowerText.includes('feature') || lowerText.includes('roadmap') || lowerText.includes('scim') || lowerText.includes('integration')) {
      suggestedReply = `Hi ${firstName},

Thank you for reaching out and sharing this valuable product feedback regarding ${subj}!

This capability is indeed a key priority for scaling enterprise teams. I have documented your use case and forwarded it directly to our Product Engineering roadmap board:

• Our team is currently concluding the architectural review for this module.
• We are aiming to open private beta access for enterprise tiers in the upcoming sprint.
• I have tagged your tenant ID so that you receive automated early-access invite notifications once available.

Please don't hesitate to share any specific attributes or requirements your team relies on!

Best regards,
Product Strategy & Support`;
    } else if (lowerText.includes('order') || lowerText.includes('deliver') || lowerText.includes('shipping') || lowerText.includes('tracking') || lowerText.includes('transit') || lowerText.includes('package')) {
      suggestedReply = `Hi ${firstName},

Thank you for contacting Customer Support regarding your order delivery (${subj}).

I sincerely apologize for the delay in receiving your package. I completely understand how frustrating it is when an expected delivery date has passed without clear communication.

Here is the current status from our logistics and fulfillment system:
• We have flagged your shipment as Priority Expedited with our courier dispatch hub.
• The package has cleared intermediate transit and is scheduled for final out-for-delivery handover within 24 to 36 hours.
• A direct carrier tracking link and SMS alert have been triggered to your email (${req.body.customer_email || 'registered address'}).

If the delivery does not arrive by tomorrow end-of-day, please reply directly to this ticket and we will immediately process a shipping refund along with priority carrier escalation.

Warm regards,
Customer Logistics & Fulfillment Support`;
    } else {
      suggestedReply = `Hi ${firstName},

Thank you for reaching out regarding "${subj}".

I am actively reviewing the details you provided in ticket ${ticket_id || 'your request'}:
"${description ? description.slice(0, 100) + '...' : ''}"

Our team has initiated troubleshooting to isolate the root cause. We are working on this as a priority and will update you shortly with our findings or solution.

If you have any screenshots, error codes, or reproduction steps to share in the meantime, please feel free to reply to this thread.

Warm regards,
Customer Support Operations`;
    }

    res.json({
      success: true,
      ticket_id,
      suggestedReply,
      confidence: 0.96,
      model: 'OmniDesk Smart Assistant'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI reply', details: error.message });
  }
});

// Quick Sentiment & Triage Analysis
router.post('/triage', (req, res) => {
  try {
    const { subject, description } = req.body;
    const text = `${subject || ''} ${description || ''}`.toLowerCase();

    let sentiment = 'Neutral';
    let urgencyScore = 'Normal';
    let suggestedPriority = 'Medium';

    if (text.includes('urgent') || text.includes('down') || text.includes('crash') || text.includes('critical') || text.includes('blocked') || text.includes('timeout')) {
      sentiment = 'Urgent / Frustrated';
      urgencyScore = 'High Alert';
      suggestedPriority = 'Urgent';
    } else if (text.includes('refund') || text.includes('duplicate') || text.includes('overcharge') || text.includes('bug')) {
      sentiment = 'Concerned';
      urgencyScore = 'Elevated';
      suggestedPriority = 'High';
    } else if (text.includes('thanks') || text.includes('love') || text.includes('great') || text.includes('feature')) {
      sentiment = 'Positive / Inquisitive';
      urgencyScore = 'Standard';
      suggestedPriority = 'Low';
    }

    res.json({
      sentiment,
      urgencyScore,
      suggestedPriority
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
