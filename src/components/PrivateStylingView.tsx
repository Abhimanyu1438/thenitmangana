import { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '../data/catalog';
import { PageRoute, StylingAppointment } from '../types';
import { ResilientImage } from './ResilientImage';

interface PrivateStylingViewProps {
  lastAppointment: StylingAppointment | null;
  onBookAppointment: (appointment: StylingAppointment) => void;
  onNavigate: (route: PageRoute) => void;
}

export function PrivateStylingView({
  lastAppointment,
  onBookAppointment,
  onNavigate,
}: PrivateStylingViewProps) {
  const [format, setFormat] = useState<'Mumbai' | 'Bengaluru' | 'Video Call'>('Mumbai');
  const [focus, setFocus] = useState('Bridal Trousseau Curation');
  const [date, setDate] = useState('2026-12-05');
  const [time, setTime] = useState('11:30 AM IST');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState<StylingAppointment | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: StylingAppointment = {
      referenceId: 'NMW-STY-' + String(Math.floor(210 + Math.random() * 780)),
      format,
      focus,
      date,
      time,
      name: name.trim(),
      email: email.trim(),
      notes: notes.trim(),
    };
    setSubmitted(record);
    onBookAppointment(record);
  };

  const activeConfirmation = submitted || lastAppointment;

  return (
    <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left 6 Columns: Atelier Visual & Locations */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <span className="font-label text-xs font-medium text-primary">Atelier Concierge</span>
          <h1 className="font-display text-4xl md:text-[52px] md:leading-[58px] text-on-surface text-balance">
            Private Styling &amp; Bespoke Commissions
          </h1>
          <p className="font-body text-base md:text-lg text-on-surface-muted text-pretty leading-relaxed">
            Meet one-on-one with our textile archivists to explore rare pit-loom weaves, custom botanical dye shades, and tailored blouse silhouettes.
          </p>

          <div className="aspect-[4/3] rounded-sm overflow-hidden bg-surface-sand">
            <ResilientImage
              src={IMAGES.stylingAtelier}
              alt="Minimalist Nitmagnaa luxury fashion atelier with draped silk textiles"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-outline-variant">
            <div>
              <h2 className="font-title text-base font-medium text-on-surface">Mumbai Atelier</h2>
              <p className="font-body text-sm text-on-surface-muted mt-1">
                12 Rampart Row, Kala Ghoda · Tue–Sun, 11:00–19:00
              </p>
            </div>
            <div>
              <h2 className="font-title text-base font-medium text-on-surface">Bengaluru Atelier</h2>
              <p className="font-body text-sm text-on-surface-muted mt-1">
                100 Feet Road, Indiranagar · Tue–Sun, 11:00–19:00
              </p>
            </div>
          </div>
        </div>

        {/* Right 6 Columns: Booking Panel */}
        <div className="lg:col-span-6 bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-6">
          {activeConfirmation ? (
            <div className="flex flex-col gap-5 py-4">
              <div className="flex items-start gap-3 pb-4 border-b border-outline-variant">
                <CheckCircle2 className="w-7 h-7 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-xs text-primary">
                    Reference #{activeConfirmation.referenceId}
                  </span>
                  <h2 className="font-headline text-2xl text-on-surface mt-1">
                    Appointment Confirmed
                  </h2>
                </div>
              </div>

              <div className="space-y-3 text-sm bg-surface p-5 rounded-sm border border-outline-variant">
                <div className="flex justify-between gap-4">
                  <span className="text-on-surface-muted">Client</span>
                  <span className="font-medium text-on-surface">{activeConfirmation.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-on-surface-muted">Location / Format</span>
                  <span className="font-medium text-on-surface">
                    {activeConfirmation.format}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-on-surface-muted">Focus</span>
                  <span className="font-medium text-on-surface">{activeConfirmation.focus}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-on-surface-muted">Schedule</span>
                  <span className="font-mono text-xs text-on-surface tabular-nums">
                    {activeConfirmation.date} · {activeConfirmation.time}
                  </span>
                </div>
              </div>

              <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                Our senior archivist will prepare curated weave swatches prior to your session and share calendar details to{' '}
                <span className="text-on-surface font-medium">{activeConfirmation.email}</span>.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    if (lastAppointment && !submitted) {
                      onBookAppointment({
                        ...lastAppointment,
                        referenceId: '',
                      });
                    }
                  }}
                  className="min-h-[44px] px-5 border border-outline bg-surface text-on-surface rounded-sm font-label text-xs font-medium hover:border-on-surface transition-colors"
                >
                  Schedule Another Session
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('collection')}
                  className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-xs font-medium hover:bg-primary-hover transition-colors"
                >
                  Preview Weaves Ahead of Visit
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <h2 className="font-headline text-2xl text-on-surface">Request an Appointment</h2>
                <Calendar className="w-5 h-5 text-on-surface-muted" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <span className="block font-label text-[13px] font-medium text-on-surface mb-2">
                    Consultation Format
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['Mumbai', 'Bengaluru', 'Video Call'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormat(opt)}
                        aria-pressed={format === opt}
                        className={`min-h-[44px] px-3 rounded-sm font-label text-xs font-medium transition-colors whitespace-nowrap ${
                          format === opt
                            ? 'border border-on-surface bg-surface text-on-surface'
                            : 'border border-outline bg-surface-white text-on-surface-muted hover:border-on-surface'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    Consultation Focus
                  </label>
                  <select
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  >
                    <option>Bridal Trousseau Curation</option>
                    <option>Bespoke Botanical Dye Commission</option>
                    <option>Seasonal Wardrobe &amp; Drape Styling</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                      Preferred Time
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                    >
                      <option>11:30 AM IST</option>
                      <option>02:30 PM IST</option>
                      <option>05:00 PM IST</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ananya Rao"
                      className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ananya@studio.in"
                      className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    Notes on Weaves or Occasion
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Looking for unbleached tussar and ivory Kanchipuram options for a winter courtyard ceremony."
                    className="w-full p-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors mt-1"
                >
                  Confirm Private Appointment
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
