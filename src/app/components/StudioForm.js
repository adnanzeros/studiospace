'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { AMENITY_OPTIONS, CATEGORY_LABELS } from '@/lib/categories';
import { resolveImage } from '@/lib/api';

const EMPTY = {
  title: '',
  category: 'photo-studio',
  hourlyRate: '',
  securityDeposit: '',
  maxCapacity: '',
  location: '',
  image: '',
  amenities: [],
  overview: '',
};

// Add Studio + Update Studio duto page e eki form. host = { name, email } (read-only)
export default function StudioForm({
  initial,
  host,
  submitLabel,
  busy,
  onSubmit,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const set = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const toggleAmenity = name =>
    set(
      'amenities',
      form.amenities.includes(name)
        ? form.amenities.filter(a => a !== name)
        : [...form.amenities, name],
    );

  // ImgBB upload: file -> ImgBB -> image URL paoa jay -> form.image e boshe -> Publish e MongoDB te save hoy
  // (actual image file ImgBB te thake, MongoDB te sudhu URL thake)
  const upload = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const key = (process.env.NEXT_PUBLIC_IMGBB_KEY || '').trim();
    if (!key || key.startsWith('YOUR_'))
      return toast.error(
        'ImgBB key is missing. Set NEXT_PUBLIC_IMGBB_KEY in .env.local and restart the dev server, or paste an image URL.',
      );
    if (!file.type.startsWith('image/'))
      return toast.error('Please choose an image file (JPG, PNG, WEBP).');
    if (file.size > 5 * 1024 * 1024)
      return toast.error('Image must be smaller than 5 MB.');

    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
        method: 'POST',
        body,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message || 'Upload failed');
      }
      const url = json.data?.display_url || json.data?.url;
      if (!url) throw new Error('ImgBB did not return an image URL');
      set('image', url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(
        `Image upload failed: ${err.message}. Try again or paste an image URL.`,
      );
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3)
      e.title = 'Title must be at least 3 characters';
    if (!(Number(form.hourlyRate) > 0))
      e.hourlyRate = 'Enter an hourly rate above $0';
    if (form.securityDeposit === '' || Number(form.securityDeposit) < 0)
      e.securityDeposit = 'Enter a deposit (0 or more)';
    if (!(Number(form.maxCapacity) >= 1))
      e.maxCapacity = 'Capacity must be at least 1';
    if (form.location.trim().length < 3)
      e.location = 'Enter the studio address';
    if (!form.image.trim()) e.image = 'Upload an image or paste an image URL';
    if (form.overview.trim().length < 20)
      e.overview = 'Overview must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = ev => {
    ev.preventDefault();
    if (!validate()) return toast.error('Please fix the highlighted fields.');
    onSubmit({
      ...form,
      title: form.title.trim(),
      location: form.location.trim(),
      overview: form.overview.trim(),
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit),
      maxCapacity: Number(form.maxCapacity),
    });
  };

  const Err = ({ k }) =>
    errors[k] ? <span className="field-err">{errors[k]}</span> : null;

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="title">Studio title</label>
          <input
            id="title"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Lumen Loft Cyc Studio"
          />
          <Err k="title" />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
              <option key={slug} value={slug}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="location">Location / address</label>
          <input
            id="location"
            value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="City, State"
          />
          <Err k="location" />
        </div>

        <div className="field">
          <label htmlFor="hourlyRate">Hourly rate ($)</label>
          <input
            id="hourlyRate"
            type="number"
            min="1"
            step="1"
            value={form.hourlyRate}
            onChange={e => set('hourlyRate', e.target.value)}
            placeholder="45"
          />
          <Err k="hourlyRate" />
        </div>

        <div className="field">
          <label htmlFor="securityDeposit">Security deposit ($)</label>
          <input
            id="securityDeposit"
            type="number"
            min="0"
            step="1"
            value={form.securityDeposit}
            onChange={e => set('securityDeposit', e.target.value)}
            placeholder="100"
          />
          <Err k="securityDeposit" />
        </div>

        <div className="field">
          <label htmlFor="maxCapacity">Max capacity (people)</label>
          <input
            id="maxCapacity"
            type="number"
            min="1"
            step="1"
            value={form.maxCapacity}
            onChange={e => set('maxCapacity', e.target.value)}
            placeholder="12"
          />
          <Err k="maxCapacity" />
        </div>

        <div className="field">
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            value={form.image}
            onChange={e => set('image', e.target.value)}
            placeholder="https://..."
          />
          <Err k="image" />
        </div>

        <div className="field full">
          <label>Or upload a photo</label>
          <div className="upload-row">
            <label
              className="btn btn-outline btn-sm"
              style={{ cursor: uploading ? 'wait' : 'pointer' }}
            >
              <Upload size={15} /> {uploading ? 'Uploading...' : 'Choose image'}
              <input
                type="file"
                accept="image/*"
                onChange={upload}
                disabled={uploading}
                hidden
              />
            </label>
            {form.image && (
              <div className="upload-prev">
                <img src={resolveImage(form.image)} alt="Studio preview" />
              </div>
            )}
          </div>
          <span className="field-hint">
            Uploaded with imgbb. The link is saved with your listing.
          </span>
        </div>

        <div className="field full">
          <label>Amenities</label>
          <div className="amen-grid">
            {AMENITY_OPTIONS.map(a => (
              <label key={a} className="amen">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                />
                {a}
              </label>
            ))}
            {form.amenities
              .filter(a => !AMENITY_OPTIONS.includes(a))
              .map(a => (
                <label key={a} className="amen">
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
          </div>
        </div>

        <div className="field full">
          <label htmlFor="overview">Detailed overview</label>
          <textarea
            id="overview"
            value={form.overview}
            onChange={e => set('overview', e.target.value)}
            placeholder="Describe the space, gear, lighting, size and house rules."
          />
          <Err k="overview" />
        </div>

        <div className="field">
          <label htmlFor="hostName">Host name</label>
          <input id="hostName" value={host?.name || ''} readOnly />
        </div>
        <div className="field">
          <label htmlFor="hostEmail">Host email</label>
          <input id="hostEmail" value={host?.email || ''} readOnly />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={busy || uploading}
        >
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
