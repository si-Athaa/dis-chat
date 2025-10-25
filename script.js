// ====== CONFIG ======
const apiKey = "tw5xtztnrvcj"; // dari getstream.io dashboard
const { StreamChat } = window.StreamChat;

// Random user unik
const randId = Math.floor(Math.random() * 9999);
const userId = "anonymous_" + randId;
const username = "Anonymous#" + randId;
const userImg = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`;

const client = StreamChat.getInstance(apiKey);
const devToken = client.devToken(userId);

(async () => {
  // connect user
  await client.connectUser({ id: userId, name: username, image: userImg }, devToken);

  // bikin / join 1 channel global
  const channel = client.channel("messaging", "wonderho-room", {
    name: "Wonderhoy Chat",
  });
  await channel.watch();

  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("msg");
  const sendBtn = document.getElementById("send");

  // tampilkan pesan lama
  channel.state.messages.forEach(renderMessage);

  // pesan baru muncul realtime
  channel.on("message.new", (event) => renderMessage(event.message));

  // kirim pesan
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    await channel.sendMessage({ text });
    input.value = "";
  }

  // render chat
  function renderMessage(msg) {
    const wrapper = document.createElement("div");
    wrapper.className = "message " + (msg.user.id === userId ? "me" : "other");

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = msg.user.image || userImg;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = `${msg.user.name}: ${msg.text}`;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
  }
})();
