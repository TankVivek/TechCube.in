const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data/tickets');
const ALG = 'aes-256-cbc';

// Derive a 32-byte key from the env secret
function getKey() {
  const secret = process.env.CHAT_ENCRYPT_KEY || 'TechCube_Default_Secret_Key_2024!';
  return crypto.createHash('sha256').update(secret).digest();
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALG, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(data) {
  const [ivHex, encHex] = data.split(':');
  const decipher = crypto.createDecipheriv(ALG, getKey(), Buffer.from(ivHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]).toString('utf8');
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function ticketPath(id) { return path.join(DATA_DIR, `${id}.enc`); }

function saveTicket(ticket) {
  ensureDir();
  fs.writeFileSync(ticketPath(ticket.id), encrypt(JSON.stringify(ticket)), 'utf8');
}

function loadTicket(id) {
  const p = ticketPath(id);
  if (!fs.existsSync(p)) return null;
  try {
    const rawData = fs.readFileSync(p, 'utf8');
    const decrypted = decrypt(rawData);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error(`Error loading/decrypting ticket ${id}:`, err);
    return null;
  }
}

function listTickets() {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.enc'));
  const list = [];
  for (const f of files) {
    const id = f.replace('.enc', '');
    const ticket = loadTicket(id);
    if (ticket) {
      list.push({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        status: ticket.status,
        createdAt: ticket.createdAt,
        hasAgent: ticket.hasAgent,
        messageCount: ticket.messages ? ticket.messages.length : 0
      });
    }
  }
  return list;
}

function createTicket(name, email) {
  const id = crypto.randomBytes(6).toString('hex');
  const ticket = { id, name, email, status: 'open', hasAgent: false, createdAt: new Date().toISOString(), messages: [] };
  saveTicket(ticket);
  return ticket;
}

function addMessage(ticketId, sender, text) {
  const ticket = loadTicket(ticketId);
  if (!ticket) return null;
  const msg = { sender, text, time: new Date().toISOString() };
  ticket.messages.push(msg);
  saveTicket(ticket);
  return msg;
}

function updateStatus(ticketId, status) {
  const ticket = loadTicket(ticketId);
  if (!ticket) return null;
  ticket.status = status;
  saveTicket(ticket);
  return ticket;
}

function setAgentFlag(ticketId, hasAgent) {
  const ticket = loadTicket(ticketId);
  if (!ticket) return null;
  ticket.hasAgent = hasAgent;
  saveTicket(ticket);
  return ticket;
}

module.exports = { createTicket, loadTicket, listTickets, addMessage, updateStatus, setAgentFlag };
