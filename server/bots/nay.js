class NayBot {
  constructor(io) {
    this.io = io;
    this.name = "Nay";
  }

  // Répondre à la commande !help
  handleHelpCommand(user) {
    const helpMessage = `
Salut! 😃 Voici toutes les commandes que tu peux utiliser ici :

🎉 Commandes fun et interactions :
!kiss <pseudo> → Envoie un bisou virtuel à quelqu'un.
!hug <pseudo> → Fais un câlin virtuel à quelqu'un.
!slap <pseudo> → Giflez quelqu'un gentiment.

🛠️ Commandes utiles :
!seen <pseudo> → Te dit la dernière fois que quelqu'un était actif.
!whois <pseudo> → Infos sur l'utilisateur.

🛡️ Pour les admins/propriétaires :
!kick <pseudo> → Expulse quelqu'un.
!ban <pseudo> → Bannit un utilisateur.
    `.trim();

    this.io.to(user.id).emit('bot_message', {
      bot: this.name,
      message: helpMessage,
      type: 'help'
    });
  }

  // Répondre à la commande !seen (à améliorer pour vraie base)
  handleSeenCommand(user, targetPseudo) {
    const responses = [
      `${targetPseudo} était en ligne il y a 5 minutes`,
      `${targetPseudo} est actuellement en ligne`,
      `Utilisateur ${targetPseudo} introuvable`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    this.io.to(user.id).emit('bot_message', {
      bot: this.name,
      message: randomResponse,
      type: 'info'
    });
  }

  // Gérer les commandes fun (!kiss, !hug, !slap)
  handleFunCommand(command, user, targetPseudo, room) {
    const actions = {
      '!kiss': 'envoie un bisou à',
      '!hug': 'fait un câlin à',
      '!slap': 'gifle'
    };

    if (actions[command] && targetPseudo) {
      this.io.to(room).emit('bot_message', {
        bot: this.name,
        message: `${user.pseudo} ${actions[command]} ${targetPseudo}`,
        type: 'fun'
      });
    }
  }

  // Traiter les messages pour détecter les commandes
  processMessage(message, user, room) {
    if (!message.startsWith('!')) return false;

    const [command, target] = message.split(' ');

    switch(command.toLowerCase()) {
      case '!help':
        this.handleHelpCommand(user);
        break;
      case '!seen':
        this.handleSeenCommand(user, target);
        break;
      case '!kiss':
      case '!hug':
      case '!slap':
        this.handleFunCommand(command.toLowerCase(), user, target, room);
        break;
      default:
        return false;
    }

    return true;
  }
}

module.exports = NayBot;