const { StreamChat } = window.StreamChat;

// Ganti API Key lo di sini 👇
const API_KEY = "tw5xtztnrvcj"; // dari dashboard GetStream

// Bikin ID unik buat user
const userId = "user_" + Math.floor(Math.random() * 10000);
const userName = prompt("Masukin nama kamu:") || "Anon";

// Koneksi ke Stream
const client = StreamChat.getInstance(API_KEY);
client.connectUser(
  { id: userId, name: userName },
  client.devToken(userId) // pakai dev token biar gak perlu backend
);

const channel = client.channel("messaging", "global-room", { name: "Atha Room" });
await channel.watch();

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

// Tampilkan pesan awal
channel.state.messages.forEach(addMessage);

// Saat pesan baru masuk
channel.on("message.new", event => addMessage(event.message));

// Kirim pesan
sendButton.onclick = async () => {
  const text = messageInput.value.trim();
  if (!text) return;
  await channel.sendMessage({ text });
  messageInput.value = "";
};

// Fungsi tampil pesan di layar
function addMessage(msg) {
  const div = document.createElement("div");
  div.className = "bubble " + (msg.user.id === userId ? "me" : "other");
  div.textContent = `${msg.user.name}: ${msg.text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

