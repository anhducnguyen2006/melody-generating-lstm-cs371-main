const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

const LSTM_ROOT = path.join(__dirname, '../../lstm-project');

function cleanName(filename) {
  return filename
    .replace(/^GOOD_/, '')
    .replace(/^FUNNY_/, '')
    .replace(/^GOODhappy/, 'happy')
    .replace(/_melody_generated(\(\d+\))?\.midi?$/i, '')
    .replace(/_melody\.midi?$/i, '')
    .replace(/_generated(\s*\(\d+\))?\.midi?$/i, '')
    .replace(/\.midi?$/i, '')
    .replace(/_/g, ' ')
    .trim();
}

function isStaffPick(filename) {
  return filename.startsWith('GOOD');
}

function isFunny(filename) {
  return filename.startsWith('FUNNY');
}

function formatDeutName(filename) {
  const match = filename.match(/deut(\d+)/);
  if (match) return `Folk Song #${match[1]}`;
  return cleanName(filename);
}

function listMidi(relDir, opts = {}) {
  const { maxItems = null, formatFn = null } = opts;
  try {
    const fullDir = path.join(LSTM_ROOT, relDir);
    let files = fs.readdirSync(fullDir)
      .filter(f => /\.(midi|mid)$/i.test(f))
      .sort();
    if (maxItems) files = files.slice(0, maxItems);
    return files.map(f => {
      const isDeutch = f.startsWith('deut');
      const displayName = formatFn
        ? formatFn(f)
        : isDeutch
        ? formatDeutName(f)
        : cleanName(f);
      return {
        name: displayName,
        file: f,
        url: `/midi/${relDir}/${encodeURIComponent(f)}`,
        staffPick: isStaffPick(f),
        funny: isFunny(f),
      };
    });
  } catch {
    return [];
  }
}

app.get('/api/tracks', (req, res) => {
  res.json([
    {
      id: 'chopin-dataset',
      label: 'Chopin / MAESTRO',
      description: "Extracted melodic lines from Frédéric Chopin's piano works (MAESTRO v3.0.0 dataset). These are the input samples the model trained on.",
      type: 'dataset',
      color: '#6366f1',
      tracks: listMidi('chopin_melodies', { maxItems: 10 }),
    },
    {
      id: 'deutschl-dataset',
      label: 'Deutschl Folklore',
      description: 'Traditional German folk songs converted from Kern (.krn) notation into MIDI. These represent the second training corpus.',
      type: 'dataset',
      color: '#10b981',
      tracks: listMidi('melodies', { maxItems: 10 }),
    },
    {
      id: 'gen-3epochs',
      label: '3 Epochs',
      description: 'Very early training — the model has barely learned from the data. Output is largely random with minimal musical structure.',
      type: 'generated',
      quality: 'early',
      qualityLabel: 'Early Stage',
      color: '#ef4444',
      tracks: listMidi('results/3-epochs'),
    },
    {
      id: 'gen-30epochs',
      label: '30 Epochs',
      description: 'Mid-training checkpoint — rhythmic patterns are beginning to emerge, but the melody often loses direction.',
      type: 'generated',
      quality: 'mid',
      qualityLabel: 'Developing',
      color: '#f97316',
      tracks: listMidi('results/30-epochs'),
    },
    {
      id: 'gen-90epochs',
      label: '90 Epochs',
      description: 'Best results — the model has internalized folk-song phrasing, producing coherent melodic arcs with natural phrase endings.',
      type: 'generated',
      quality: 'good',
      qualityLabel: 'Best Quality',
      color: '#8b5cf6',
      tracks: listMidi('results/90-epochs', { maxItems: 16 }),
    },
    {
      id: 'gen-chopin',
      label: 'Chopin-Trained',
      description: 'Trained exclusively on Chopin works — captures classical ornamentation and longer note durations characteristic of Romantic piano music.',
      type: 'generated',
      quality: 'chopin',
      qualityLabel: 'Classical Style',
      color: '#3b82f6',
      tracks: listMidi('results/chopin-dataset'),
    },
  ]);
});

app.get('/midi/*', (req, res) => {
  const relPath = decodeURIComponent(req.params[0]);
  const filePath = path.join(LSTM_ROOT, relPath);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(path.normalize(LSTM_ROOT))) {
    return res.status(403).send('Forbidden');
  }
  if (!fs.existsSync(normalized)) {
    return res.status(404).send('Not found');
  }
  res.setHeader('Content-Type', 'audio/midi');
  res.sendFile(normalized);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MelodyTron server → http://localhost:${PORT}`);
});
