const axios = require("axios");
const fs = require("fs");
const path = namespacePath = require("path"); // Keeping exact pattern
const { exec } = require("child_process");

// ==========================================
// 🎯 আপনার দেওয়া গ্রুপের চ্যাট আইডি সমূহ (২ নম্বর আইডি আপডেট করা হয়েছে)
// ==========================================
const GROUP_1_ID = "2285733362243325";
const GROUP_2_ID = "3449886188517413";

const apiList = "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";
const getMainAPI = async () => (await axios.get(apiList)).data.simsimi;

// ==========================================
// 👑 TikTok VIP Helper Engine & Card Templates
// ==========================================
function getVipMenuCard(userName) {
  return `👑 ═════════════════════════ 👑
       🌟 𝓣𝓘𝓚𝓣𝓞𝓚 𝓑𝓞𝓣 𝓥𝓘𝓟 𝓜𝓔𝓝𝓔 🌟
👑 ═════════════════════════ 👑

👤 Requested by: ${userName}

নিচে আপনার প্রয়োজনীয় সার্ভিস অনুযায়ী কমান্ডসমূহ দেওয়া হলো:

🎬 1. নো-ওয়াটারমার্ক এইচডি ভিডিও:
└─ [ /video <টিকটক লিংক> ]
└─ উদাহরণ: /video https://vt.tiktok.com/xxxx

🎵 2. এইচডি ভয়েস / অডিও কনভার্টার:
└─ [ /audio <টিকটক লিংক> ]
└─ উদাহরণ: /audio https://vt.tiktok.com/xxxx

🖼️ 3. আল্ট্রা এইচডি ক্লিয়ার ব্যানার:
└─ [ /banner <টিকটক লিংক> ]
└─ (লিঙ্ক দিলে বট আপনাকে ব্যানার সংখ্যা জানতে চাইবে)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 VIP Features Active:
✨ Auto Glitch & Blur Filtering
✨ HD Frame Extraction (Max 12 Banners)
✨ User-Name Personalized Output
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

function getVipNoticeCard(userName, actionStr) {
  return `❖ ══════════════════════ ❖
       ⚡ 𝓥𝓘𝓟 𝓟𝓡𝓞𝓒𝓔𝓢𝓢𝓘𝓝𝓖 ⚡
❖ ══════════════════════ ❖

👤 Client Name: ${userName}
🎯 Action: Generating ${actionStr}
⏳ Status: Please wait a moment...

✨ আপনার রিকোয়েস্টটি হাই-স্পিড সার্ভারে প্রসেস করা হচ্ছে!`;
}

function getVipBannerAskCard(userName) {
  return `❖ ══════════════════════ ❖
       🖼️ 𝓥𝓘𝓟 𝓑𝓐𝓝𝓝𝓔𝓡 𝓢𝓔𝓛𝓔𝓒𝓔𝓞𝓝
❖ ══════════════════════ ❖

👤 Hello, ${userName}!

আপনার ভিডিওটি পাওয়া গেছে। আপনি কতটি আল্ট্রা এইচডি ব্যানার এক্সট্র্যাক্ট করতে চান?

📌 সর্বনিম্ন/সর্বোচ্চ: ১ থেকে ১২টি।
💡 অনুগ্রহ করে এই মেসেজে রিপ্লাই করে অথবা চ্যাটে শুধুমাত্র সংখ্যাটি লিখুন (যেমন: 3, 5, অথবা 12)।`;
}

function getVipSuccessCard(userName, actionStr, countInfo = "") {
  return `♛ ══════════════════════ ♛
       ✅ 𝓥𝓘𝓟 𝓓𝓞𝓦𝓝𝓛𝓞𝓐𝓓 𝓒𝓞𝓜𝓟𝓛𝓔𝓣𝓔
♛ ══════════════════════ ♛

👤 Prepared for: ${userName}
🎉 Task: ${actionStr} ${countInfo ? `(${countInfo} Banners)` : ''}
⚡ Status: Successfully Delivered!

🌟 আপনার সাথে থাকার জন্য ধন্যবাদ!`;
}

async function runTikTokPython(action, url, param = "12") {
  return new Promise((resolve) => {
    const pyScript = path.join(__dirname, "tiktok_toolkit.py");
    const cmd = `python3 "${pyScript}" ${action} "${url}" "${param}"`;
    exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Python Execution Error:", error);
        return resolve(null);
      }
      try {
        const data = JSON.parse(stdout.trim());
        return resolve(data);
      } catch (e) {
        return resolve(null);
      }
    });
  });
}

// LALA.json ফাইল পড়ার ফাংশন
function getLocalReply(userQuery) {
  try {
    const filePath = path.join(__dirname, "LALA.json");
    if (!fs.existsSync(filePath)) return null;

    const rawData = fs.readFileSync(filePath, "utf8");
    const customData = JSON.parse(rawData);
    const query = userQuery.toLowerCase().trim();

    if (Array.isArray(customData)) {
      for (const item of customData) {
        if (item.user && item.user.toLowerCase().trim() === query) {
          return item.mime || item.ans || item.reply;
        }
      }
    } else if (customData && typeof customData === "object") {
      for (const key in customData) {
        if (key.toLowerCase().trim() === query) {
          return customData[key];
        }
      }
    }
  } catch (e) {
    console.error("LALA.json পড়তে সমস্যা হয়েছে:", e.message);
  }
  return null;
}

// ----------------------------------------------------
// ✨ গ্রুপ ১ ও ২-এ মিডিয়া এবং টেক্সট ফরওয়ার্ড করার হেল্পার ফাংশন
// ----------------------------------------------------
async function processGroupBroadcast(api, event, fullText) {
  const parts = fullText.trim().split(/\s+/);
  const firstWord = parts[0].toLowerCase();

  const isGroup1 = (firstWord === "#1" || firstWord === "1" || firstWord === "/1");
  const isGroup2 = (firstWord === "#2" || firstWord === "2" || firstWord === "/2");
  const isCheckId = (firstWord === "#id" || firstWord === "id" || firstWord === "/id");

  if (isCheckId) {
    api.sendMessage(`🆔 This Group/Chat ID: ${event.threadID}`, event.threadID, event.messageID);
    return true;
  }

  if (isGroup1 || isGroup2) {
    const targetGroupID = isGroup1 ? GROUP_1_ID : GROUP_2_ID;
    const groupNameStr = isGroup1 ? "গ্রুপ ১" : "গ্রুপ ২";
    const msgText = parts.slice(1).join(" ");

    let mediaUrl = null;
    let fileExt = ".mp3";

    // ১. চেক রিপ্লাই অথবা ডিরেক্ট অ্যাটাচমেন্ট (Video, Audio, Voice, Photo)
    const attachments = (event.type === "message_reply" && event.messageReply.attachments?.length > 0)
      ? event.messageReply.attachments
      : event.attachments;

    if (attachments && attachments.length > 0) {
      const att = attachments[0];
      mediaUrl = att.url;
      if (att.type === "video") fileExt = ".mp4";
      else if (att.type === "photo") fileExt = ".jpg";
      else fileExt = ".mp3";
    }

    // ২. যদি মিডিয়া ফাইল পাওয়া যায়
    if (mediaUrl) {
      const tempPath = path.join(__dirname, `media_${Date.now()}${fileExt}`);
      try {
        const response = await axios({
          method: 'get',
          url: mediaUrl,
          responseType: 'stream'
        });

        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);

        writer.on('finish', () => {
          const msgPayload = {
            body: msgText || "📁 Attachment Forwarded",
            attachment: fs.createReadStream(tempPath)
          };

          api.sendMessage(msgPayload, String(targetGroupID), (err, info) => {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            if (err) {
              return api.sendMessage(`❌ ${groupNameStr}-এ ফাইল পাঠাতে ব্যর্থ! Error: ${err.message}`, event.threadID, event.messageID);
            }
            
            // কন্ট্রোল করার জন্য মেসেজ আইডি ট্র্যাক করা (Reply সিস্টেমের জন্য)
            if (info && info.messageID) {
              if (!global.client.handleReply) global.client.handleReply = [];
              global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                targetGroup: targetGroupID,
                sourceThread: event.threadID,
                type: "group_forward_reply"
              });
            }

            return api.sendMessage(`✅ ফাইলটি সফলভাবে ${groupNameStr}-এ পাঠানো হয়েছে এবং কন্ট্রোল সিস্টেমে যুক্ত হয়েছে!`, event.threadID, event.messageID);
          });
        });

        writer.on('error', (err) => {
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          api.sendMessage(`❌ ডাউনলোডে সমস্যা হয়েছে: ${err.message}`, event.threadID, event.messageID);
        });

      } catch (e) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        api.sendMessage(`❌ ত্রুটি: ${e.message}`, event.threadID, event.messageID);
      }
      return true;
    }

    // ৩. শুধু টেক্সট হলে
    if (!msgText.trim()) {
      api.sendMessage(`⚠️ ${groupNameStr}-এ পাঠানোর জন্য কোনো টেক্সট বা মিডিয়া লেখেননি!`, event.threadID, event.messageID);
      return true;
    }

    api.sendMessage(msgText, String(targetGroupID), (err, info) => {
      if (err) {
        return api.sendMessage(`❌ ${groupNameStr}-এ মেসেজ পাঠাতে ব্যর্থ হয়েছে! Error: ${err.message}`, event.threadID, event.messageID);
      }

      // কন্ট্রোল করার জন্য মেসেজ আইডি ট্র্যাক করা (Reply সিস্টেমের জন্য)
      if (info && info.messageID) {
        if (!global.client.handleReply) global.client.handleReply = [];
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          targetGroup: targetGroupID,
          sourceThread: event.threadID,
          type: "group_forward_reply"
        });
      }

      return api.sendMessage(`✅ মেসেজটি সফলভাবে ${groupNameStr}-এ পাঠানো হয়েছে!`, event.threadID, event.messageID);
    });
    return true;
  }

  return false;
}

module.exports.config = {
  name: "baby",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ULLASH",
  description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
  commandCategory: "Chat",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: true
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const fullText = (event.body || args.join(" ")).trim();

    if (!fullText) {
      const ran = ["Bolo baby", "hum"];
      const r = ran[Math.floor(Math.random() * ran.length)];
      return api.sendMessage(r, event.threadID, (err, info) => {
        if (!err) {
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      });
    }

    // #1, #2 এবং #id চেক (মিডিয়া ও টেক্সট সহ)
    if (await processGroupBroadcast(api, event, fullText)) return;

    const inputParts = fullText.split(/\s+/);
    const command = inputParts[0].toLowerCase().replace(/^[\/#]/, "");
    const rawQuery = inputParts.slice(1).join(" ") || fullText;

    // 👑 ----------------------------------------------------
    // ✨ TikTok VIP Commands Processing Logic
    // ----------------------------------------------------
    if (command === "menu") {
      return api.sendMessage(getVipMenuCard(senderName), event.threadID, event.messageID);
    }

    if (command === "video" && inputParts.length >= 2) {
      const tiktokUrl = inputParts[1];
      api.sendMessage(getVipNoticeCard(senderName, "No-Watermark Video"), event.threadID, event.messageID);
      
      const result = await runTikTokPython("video", tiktokUrl);
      if (result && result.status === "ok" && result.file && fs.existsSync(result.file)) {
        const msgPayload = {
          body: getVipSuccessCard(senderName, "No-Watermark Video"),
          attachment: fs.createReadStream(result.file)
        };
        return api.sendMessage(msgPayload, event.threadID, () => {
          if (fs.existsSync(result.file)) fs.unlinkSync(result.file);
        }, event.messageID);
      } else {
        return api.sendMessage(`❌ [VIP Error]: ভিডিও প্রসেস করা সম্ভব হয়নি। লিঙ্ক চেক করুন।`, event.threadID, event.messageID);
      }
    }

    if (command === "audio" && inputParts.length >= 2) {
      const tiktokUrl = inputParts[1];
      api.sendMessage(getVipNoticeCard(senderName, "HD Audio/Voice"), event.threadID, event.messageID);
      
      const result = await runTikTokPython("audio", tiktokUrl);
      if (result && result.status === "ok" && result.file && fs.existsSync(result.file)) {
        const msgPayload = {
          body: getVipSuccessCard(senderName, "HD Audio/Voice"),
          attachment: fs.createReadStream(result.file)
        };
        return api.sendMessage(msgPayload, event.threadID, () => {
          if (fs.existsSync(result.file)) fs.unlinkSync(result.file);
        }, event.messageID);
      } else {
        return api.sendMessage(`❌ [VIP Error]: অডিও কনভার্ট করা সম্ভব হয়নি। লিঙ্ক চেক করুন।`, event.threadID, event.messageID);
      }
    }

    if (command === "banner" && inputParts.length >= 2) {
      const tiktokUrl = inputParts[1];
      return api.sendMessage(getVipBannerAskCard(senderName), event.threadID, (err, info) => {
        if (!err && info) {
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            tiktokUrl: tiktokUrl,
            type: "tiktok_banner_count"
          });
        }
      }, event.messageID);
    }

    const simsim = await getMainAPI();

    if (["remove", "rm"].includes(command)) {
      const parts = rawQuery.replace(/^(remove|rm)\s*/i, "").split(" - ");
      if (parts.length < 2) return api.sendMessage("Use: remove [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "list") {
      const res = await axios.get(`${simsim}/list`);
      if (res.data.code === 200) {
        return api.sendMessage(
          `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\nDeveloper: ${res.data.author}`,
          event.threadID, event.messageID
        );
      } else return api.sendMessage(`Error: ${res.data.message}`, event.threadID, event.messageID);
    }

    if (command === "edit") {
      const parts = rawQuery.replace(/^edit\s*/i, "").split(" - ");
      if (parts.length < 3) return api.sendMessage("Use: edit [Q] - [Old] - [New]", event.threadID, event.messageID);
      const [ask, oldReply, newReply] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "teach") {
      const parts = rawQuery.replace(/^teach\s*/i, "").split(" - ");
      if (parts.length < 2) return api.sendMessage("Use: teach [Q] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts.map(p => p.trim());
      const groupID = event.threadID;
      let groupName = event.threadName ? event.threadName : "";
      try {
        if (!groupName && groupID != uid) {
          const threadInfo = await api.getThreadInfo(groupID);
          if (threadInfo?.threadName) groupName = threadInfo.threadName;
        }
      } catch {}

      let teachUrl = `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}&groupID=${encodeURIComponent(groupID)}`;
      if (groupName) teachUrl += `&groupName=${encodeURIComponent(groupName)}`;
      const res = await axios.get(teachUrl);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    // ১. LALA.json চেক
    const localReply = getLocalReply(fullText);
    if (localReply) {
      return api.sendMessage(localReply, event.threadID, (err, info) => {
        if (!err) {
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    // ২. AI API চেক
    const query = fullText.toLowerCase();
    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
    const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

    for (const rep of replies) {
      await new Promise(resolve => {
        api.sendMessage(rep, event.threadID, (err, info) => {
          if (!err) {
            if (!global.client.handleReply) global.client.handleReply = [];
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }

  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users, handleReply }) {
  try {
    const senderName = await Users.getNameUser(event.senderID);
    const replyText = event.body ? event.body.trim() : "";
    if (!replyText) return;

    // 👑 ব্যানার কাউন্টের উত্তর রিসিভ করা
    if (handleReply.type === "tiktok_banner_count") {
      let count = parseInt(replyText);
      if (isNaN(count) || count < 1) count = 12;
      if (count > 12) count = 12;

      api.sendMessage(getVipNoticeCard(senderName, `${count} Ultra HD Banners`), event.threadID, event.messageID);

      const result = await runTikTokPython("banner", handleReply.tiktokUrl, String(count));
      if (result && result.status === "ok" && result.files && result.files.length > 0) {
        const streams = result.files.map(f => fs.createReadStream(f));
        const msgPayload = {
          body: getVipSuccessCard(senderName, "Ultra HD Banner Extraction", count),
          attachment: streams
        };

        return api.sendMessage(msgPayload, event.threadID, () => {
          result.files.forEach(f => {
            if (fs.existsSync(f)) fs.unlinkSync(f);
          });
        }, event.messageID);
      } else {
        return api.sendMessage(`❌ [VIP Error]: ব্যানার তৈরি করতে সমস্যা হয়েছে। লিঙ্কটি চেক করুন।`, event.threadID, event.messageID);
      }
    }

    // 🔥 ফরোয়ার্ড করা মেসেজে কেউ রিপ্লাই দিলে সেটি কন্ট্রোল গ্রুপে বা সোর্স চ্যাটে দেখানোর এবং ওয়ান-টাইম ম্যানেজ করার লজিক
    if (handleReply.type === "group_forward_reply") {
      const replierName = senderName || "Unknown User";
      const targetGroup = handleReply.targetGroup;
      
      // কন্ট্রোল গ্রুপে বা যেখান থেকে পাঠানো হয়েছিল সেখানে নোটিফিকেশন পাঠানো যে কে কী রিপ্লাই দিয়েছে
      const notificationMsg = `💬 [Group Reply Notification]\n👤 User: ${replierName} (ID: ${event.senderID})\n✍️ Message: "${replyText}"\n\n(এই মেসেজের নিচে আপনিও রিপ্লাই করে সরাসরি উত্তর পাঠাতে পারেন - যা একবারই কার্যকর হবে)`;
      
      api.sendMessage(notificationMsg, handleReply.sourceThread, (err, info) => {
        if (!err && info && info.messageID) {
          // পুনরায় ওই মেসেজে অ্যাডমিনের রিপ্লাই ট্র্যাক করার জন্য হ্যান্ডেল যুক্ত করা (সরাসরি ইউজারের কাছে পাঠানোর জন্য)
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            targetGroup: targetGroup,
            targetUser: event.senderID,
            type: "admin_direct_reply"
          });
        }
      });
      return;
    }

    // অ্যাডমিন যখন কন্ট্রোল গ্রুপ থেকে নোটিফিকেশন মেসেজে রিপ্লাই দিয়ে ইউজারকে সরাসরি উত্তর পাঠাবেন (শুধুমাত্র একবারের জন্য)
    if (handleReply.type === "admin_direct_reply") {
      const targetGroup = handleReply.targetGroup;
      const targetUser = handleReply.targetUser;

      const payload = {
        body: `💬 রিপ্লাই (${senderName}): ${replyText}`
      };

      api.sendMessage(payload, String(targetGroup), (err) => {
        if (err) {
          return api.sendMessage(`❌ মেসেজ পাঠাতে ব্যর্থ! Error: ${err.message}`, event.threadID, event.messageID);
        }
        return api.sendMessage(`✅ আপনার উত্তরটি সফলভাবে নির্দিষ্ট ব্যবহারকারীর কাছে পাঠানো হয়েছে!`, event.threadID, event.messageID);
      });
      return;
    }

    if (handleReply.type === "food_check") {
      const lowerReply = replyText.toLowerCase();
      if (lowerReply.includes("হ্যাঁ") || lowerReply.includes("খাইছি") || lowerReply.includes("হ্যা")) {
        return api.sendMessage("ভালো 😊", event.threadID, event.messageID);
      } else if (lowerReply.includes("না") || lowerReply.includes("খাই নাই") || lowerReply.includes("নাই")) {
        return api.sendMessage("কেন খাও নাই? 🥺", event.threadID, event.messageID);
      }
    }

    const localReply = getLocalReply(replyText);
    if (localReply) {
      return api.sendMessage(localReply, event.threadID, (err, info) => {
        if (!err) {
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    const simsim = await getMainAPI();
    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);
    const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

    for (const rep of replies) {
      await new Promise(resolve => {
        api.sendMessage(rep, event.threadID, (err, info) => {
          if (!err) {
            if (!global.client.handleReply) global.client.handleReply = [];
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }

  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    // 🔥 এখানে #1 এবং #2 ক্যাচ করা হচ্ছে (সাথে মিডিয়া ও কন্ট্রোলিং সিস্টেম যুক্ত)
    if (await processGroupBroadcast(api, event, event.body)) return;

    const senderName = await Users.getNameUser(event.senderID);
    const senderID = event.senderID;
    const simsim = await getMainAPI();

    const greetings = [
      "বেশি bot Bot করলে leave নিবো কিন্তু😒😒",
      "শুনবো না😼 তুমি আমার বস সাহু কে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
      "আমি আবাল দের সাথে কথা বলি না,ok😒",
      "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈",
      "Bolo Babu, তুমি কি আমার বস সাহু কে ভালোবাসো? 🙈💋",
      "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
      "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?",
      "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬",
      "I love you janu🥰",
      "আরে Bolo আমার জান ,কেমন আছো?😚",
      "আজ বট বলে অসম্মান করছি,😰😿",
      "Hop beda😾,Boss বল boss😼",
      "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু",
      "আমাকে না ডেকে মেয়ে হলে বস সাহুর ইনবক্সে চলে যা 🌚😂 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/100044713412032",
      "আমাকে বট না বলে , বস সাহু কে জানু বল জানু 😘",
      "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋",
      "আরে বলদ এতো ডাকিস কেন🤬",
      "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘",
      "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",
      "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘",
      "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣",
      "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
      "আমাকে ডেকো না,আমি বস সাহুর সাথে ব্যাস্ত আছি",
      "কি হলো , মিস্টেক করচ্ছিস নাকি🤣",
      "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
      "জান মেয়ে হলে বস সাহুর ইনবক্সে চলে যাও 😍🫣💕 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/100044713412032",
      "কালকে দেখা করিস তো একটু 😈",
      "হা বলো, শুনছি আমি 😏",
      "আর কত বার ডাকবি ,শুনছি তো",
      "হুম বলো কি বলবে😒",
      "বলো কি করতে পারি তোমার জন্য",
      "আমি তো অন্ধ কিছু দেখি না🐸 😎",
      "আরে বোকা বট না জানু বল জানু😌",
      "বলো জানু 🌚",
      "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
      "হুম জান তোমার ওই খানে উম্মহ😑😘",
      "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
      "jang hanga korba😒😬",
      "হুম জান তোমার অইখানে উম্মমাহ😷😘",
      "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰",
      "ভালোবাসার নামক আবলামি করতে চাইলে বস সাহুর ইনবক্সে গুতা দিন ~🙊😘🤣 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/100044713412032",
      "আমাকে এতো না ডেকে বস সাহু এর কে একটা গফ দে 🙄",
      "আমাকে এতো না ডেকছ কেন ভলো টালো বাসো নাকি🤭🙈",
      "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻",
      "আমি এখন বস সাহু এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
      "আমাকে না ডেকে আমার বস সাহু কে একটা জি এফ দাও-😽🫶🌺",
      "ঝাং থুমালে আইলাপিউ পেপি-💝😽",
      "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
      "জান তোমার বান্ধবী রে আমার বস সাহুর হাতে তুলে দিবা-🙊🙆‍♂",
      "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
      "ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦",
      "চুনা ও চুনা আমার বস সাহু এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭",
      "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",
      "জান হাঙ্গা করবা-🙊😝🌻",
      "জান মেয়ে হলে চিপায় আসো বস সাহুর থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
      "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼",
      "আমার বস সাহুর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস সাহু ইসলামে'র জন্য দোয়া করবেন-💝💚🌺🌻",
      "- ভালোবাসা নামক আবলামি করতে মন চাইলে আমার বস সাহুর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐧𝐤 🌻:- https://www.facebook.com/100044713412032",
      "আমার জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
      "কিরে প্রেম করবি তাহলে বস সাহুর ইনবক্সে গুতা দে 😘🤌 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/100044713412032",
      "জান আমার বস সাহু কে বিয়ে করবা-🙊😘🥳",
      "-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦",
      "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂",
      "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস সাহু কে দান করেন-🥱🐰🍒",
      "-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧",
      "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস সাহু কে-🐸😾🔪",
      "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧",
      "-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸",
      "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
      "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",
      "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗",
      "কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻",
      "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",
      "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻",
      "-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻",
      "প্রেম করতে চাইলে বস সাহুর ইনবক্সে চলে যা 😏🐸 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/100044713412032",
      "-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস সাহু ধরতে পারছে না-🐸🥲",
      "-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️",
      "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস সাহু এর সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗",
      "—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস সাহু এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️",
      "-রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜",
      "সুন্দর মাইয়া মানেই-🥱আমার বস সাহু'র বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗",
      "এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂",
      "-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸",
      "ভালোবাসার নামক আবলামি করতে চাইলে বস সাহুর ইনবক্সে গুতা দিন🤣😼",
      "মেয়ে হলে বস সাহুর ইনবক্সে চলে যা 🤭🤣😼 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/100044713412032",
      "হুদাই আমারে শয়তানে লারে-😝😑☹️",
      "-𝗜 𝗟𝗢𝗩𝗘 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸",
      "-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦",
      "-কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧",
      "-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱",
      "-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋",
      "-ইস কেউ যদি বলতো-🙂-আমার শুধু তোমাকেই লাগবে-💜🌸",
      "-ওই বেডি তোমার বাসায় না আমার বস সাহু মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস সাহু কে জানে মারার কি দরকার-🙄🤧",
      "-একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে ওর মতো আর কেউ ভালবাসেনি-🙂😅",
      "-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧",
      "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦",
      "-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস সাহু এর মনটা ছাড়া-🥴😑😏",
      "-𝫤তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵",
      "-আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸"
    ];

    const directLocalReply = getLocalReply(raw);
    if (directLocalReply) {
      return api.sendMessage(directLocalReply, event.threadID, (err, info) => {
        if (!err) {
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    if (raw === "খাবার খাইছো" || raw.includes("খাবার খাইছো")) {
      return api.sendMessage("হ্যাঁ খাইছি।\nতুমি খাইছো?", event.threadID, (err, info) => {
        if (!err) {
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "food_check"
          });
        }
      }, event.messageID);
    }

    if (
      raw === "baby" || raw === "bot" || raw === "bby" ||
      raw === "jan" || raw === "xan" || raw === "জান" ||
      raw === "বট" || raw === "বেবি"
    ) {
      const randomReply = greetings[Math.floor(Math.random() * greetings.length)];
      return api.sendMessage(randomReply, event.threadID, (err, info) => {
        if (!err) {
          if (!global.client.handleReply) global.client.handleReply = [];
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    if (
      raw.startsWith("baby ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||
      raw.startsWith("jan ") || raw.startsWith("xan ") ||
      raw.startsWith("জান ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")
    ) {
      const query = raw.replace(/^baby\s+|^bot\s+|^bby\s+|^jan\s+|^xan\s+|^জান\s+|^বট\s+|^বেবি\s+/i, "").trim();
      if (!query) return;

      const subLocalReply = getLocalReply(query);
      if (subLocalReply) {
        return api.sendMessage(subLocalReply, event.threadID, (err, info) => {
          if (!err) {
            if (!global.client.handleReply) global.client.handleReply = [];
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: senderID,
              type: "simsimi"
            });
          }
        }, event.messageID);
      }

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      for (const rep of replies) {
        await new Promise(resolve => {
          api.sendMessage(rep, event.threadID, (err, info) => {
            if (!err) {
              if (!global.client.handleReply) global.client.handleReply = [];
              global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "simsimi"
              });
            }
            resolve();
          }, event.messageID);
        });
      }
    }

  } catch (err) {
    console.error("HandleEvent Error:", err);
  }
};
