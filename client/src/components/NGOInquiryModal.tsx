import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type NGOInquiryModalProps = {
  open: boolean;
  onClose: () => void;
};

type InquiryForm = {
  organisation: string;
  contactName: string;
  email: string;
  phone: string;
  inquiry: string;
};

const emptyForm: InquiryForm = {
  organisation: "",
  contactName: "",
  email: "",
  phone: "",
  inquiry: "",
};

export default function NGOInquiryModal({ open, onClose }: NGOInquiryModalProps) {
  const [form, setForm] = useState<InquiryForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const setField = <K extends keyof InquiryForm>(field: K, value: InquiryForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const valid = form.organisation.trim().length >= 2 && form.contactName.trim().length >= 2 && emailValid && form.inquiry.trim().length >= 10;

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [open, onClose]);

  if (!open) return null;

  const close = () => {
    setSubmitted(false);
    setForm(emptyForm);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ngo-inquiry-title" onClick={(event) => { if (event.currentTarget === event.target) close(); }}>
      <div className="modal">
        <div className="modal-header">
          <div><span className="eyebrow">Client-side demonstration only</span><h2 id="ngo-inquiry-title">NGO inquiry</h2></div>
          <button className="close-button" type="button" aria-label="Close NGO inquiry form" onClick={close}><X size={18} /></button>
        </div>
        {submitted ? (
          <>
            <div className="success-box"><strong>Thank you for the demonstration inquiry.</strong>Your message was captured for this screen only. CuraNet does not send, store, or route NGO inquiries, and this directory does not represent a partner network.</div>
            <div className="hero-actions"><button className="button button-primary" type="button" onClick={close}>Close inquiry <ArrowRight size={15} /></button></div>
          </>
        ) : (
          <>
            <p className="modal-copy"><b>For demonstration purposes:</b> use this form to describe an NGO or CSR information need. It does not contact an organisation or create a partnership request. Do not include confidential beneficiary or medical information.</p>
            <form onSubmit={(event) => { event.preventDefault(); if (valid) setSubmitted(true); }}>
              <div className="form-grid">
                <div className="form-field"><label htmlFor="ngo-organisation">Organisation name <span className="required">*</span></label><input id="ngo-organisation" className="form-control" autoFocus value={form.organisation} onChange={(event) => setField("organisation", event.target.value)} required /></div>
                <div className="form-field"><label htmlFor="ngo-contact-name">Your name <span className="required">*</span></label><input id="ngo-contact-name" className="form-control" autoComplete="name" value={form.contactName} onChange={(event) => setField("contactName", event.target.value)} required /></div>
                <div className="form-field"><label htmlFor="ngo-email">Work email <span className="required">*</span></label><input id="ngo-email" className="form-control" type="email" autoComplete="email" placeholder="you@example.org" value={form.email} onChange={(event) => setField("email", event.target.value)} required />{form.email && !emailValid && <span className="form-error">Enter a valid email address.</span>}</div>
                <div className="form-field"><label htmlFor="ngo-phone">Phone number</label><input id="ngo-phone" className="form-control" type="tel" autoComplete="tel" placeholder="Optional" value={form.phone} onChange={(event) => setField("phone", event.target.value)} /></div>
                <div className="form-field full"><label htmlFor="ngo-inquiry">What would you like to discuss? <span className="required">*</span></label><textarea id="ngo-inquiry" className="form-control" rows={5} placeholder="For example: how a public reference directory could support equipment-literacy outreach." value={form.inquiry} onChange={(event) => setField("inquiry", event.target.value)} required /><span className="form-hint">At least 10 characters. This remains a client-side demonstration capture.</span></div>
              </div>
              <div className="form-footer"><span className="form-hint">Required fields keep the inquiry clear and usable.</span><button className="button button-primary" type="submit" disabled={!valid}>Submit NGO inquiry <ArrowRight size={15} /></button></div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
