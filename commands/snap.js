module.exports = {
  name: "snap",
  description: "Shows a random photo of Esko",
  guildOnly: "true",
  execute(client, message) {
    const snaps = [
      "https://i.imgur.com/gop8zjq.gifv",
      "https://i.imgur.com/OPpzkIT.jpg",
      "https://i.imgur.com/RkbyxiJ.jpg",
      "https://i.imgur.com/tykUo8d.jpg",
      "https://i.imgur.com/LSVMdoO.jpg",
      "https://i.imgur.com/a8nPqie.jpg",
      "https://i.imgur.com/retJSRh.jpg",
      "https://i.imgur.com/PQAYSHl.jpg",
      "https://imgur.com/MOU9lN9",
      "https://imgur.com/FthBd4c",
      "https://imgur.com/sww2YAA",
      "https://imgur.com/MfkkAUW",
      "https://imgur.com/3Ax0z97",
      "https://imgur.com/6yNHNYw",
      "https://imgur.com/UdRL2xb",
      "https://imgur.com/lNGTQPq",
      "https://imgur.com/xbI7XXS",
      "https://imgur.com/x3fBCEK",
      "https://imgur.com/w4OA1V8",
      "https://imgur.com/kdEwYXK",
      "https://imgur.com/sRWNDSD",
      "https://imgur.com/ehbV357",
      "https://imgur.com/kNxueG3",
      "https://imgur.com/3cxfjtQ",
      "https://imgur.com/aFDQBhD",
      "https://imgur.com/XWFtNEi",
      "https://imgur.com/ziHOkyB",
      "https://imgur.com/jbvEoly",
      "https://imgur.com/tYaLHVs",
      "https://imgur.com/qex4P3m",
      "https://imgur.com/O9cLyGG",
      "https://imgur.com/2XDJjcv",
      "https://imgur.com/MXpsryL",
      "https://imgur.com/ig4fjdP",
      "https://imgur.com/UWPNSQW",
      "https://imgur.com/IM6i1tl",
      "https://imgur.com/HofxDJe",
      "https://imgur.com/PcaVT5A",
      "https://imgur.com/hJgXzQg",
      "https://imgur.com/dN3cPFH",
      "https://imgur.com/DxKm9wu",
      "https://imgur.com/rGn67YP",
      "https://imgur.com/thypYHc",
      "https://imgur.com/5dVTKUk",
      "https://imgur.com/UxxKnTF",
    ];

    function getRandomIntInclusive(max) {
      min = Math.ceil(0);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    //gets the url using getRandomIntInclusive
    const url = snaps[getRandomIntInclusive(snaps.length)];

    const messageChannel = message.channel;
    const thisMessage = message;
    message.delete(thisMessage);
    messageChannel.send(url);
  },
};
