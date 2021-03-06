/*jslint node: true */
"use strict";

const app = require("./../bot.js");

const properties = {
	command: "avaa",
	description: "Lisää/poistaa annetun paikkakunnan kanavan oikeudet kutsuvalta käyttäjältä, lähettää viestin jos annettua kanavaa ei löytynyt",
	visible: true,
	arguments: ["<paikkakunta>"]
};

function run(message, args) {
    if (typeof args[1] !== 'undefined') {
        let bPrivate = message.channel instanceof app.discord.DMChannel;
        let strPaikkakunta = args[1];
        let channels = app.client.channels.filter(ch => ch.parentID === app.snowflakes.categoryPaikkakunnat && ch.name.toLowerCase() === strPaikkakunta.toLowerCase());
        if(channels.size > 0) {
            channels.forEach(ch => {
                const perms = ch.permissionOverwrites.get(message.author.id);
                if(perms) {
                    // poistetaan
                    ch.permissionOverwrites.get(message.author.id).delete();
                    const reply = 'Oikeudet kanavalle `' + strPaikkakunta + '` poistettu.';
                    if (bPrivate) {
                        message.author.send(reply);
                    } else {
                        message.channel.send(reply);
                    }
                } else {
                    // lisätään
                    ch.overwritePermissions(message.author.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true
                    }, 'Bottikomento');
                    const reply = 'Oikeudet kanavalle `' + strPaikkakunta + '` lisätty.';
                    if (bPrivate) {
                        message.author.send(reply);
                    } else {
                        message.channel.send(reply);
                    }
                }
            });
        } else {
            const reply = 'Kanavaa `' + strPaikkakunta + '` ei löytynyt.';
            if (bPrivate) {
                message.author.send(reply);
            } else {
                message.channel.send(reply);
            }
        }
    }
}
exports.properties = properties;
exports.run = run;

