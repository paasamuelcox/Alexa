/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var Alexa = require('alexa-sdk');

var states = {
  STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
  DDMODE: '_DDMODE',
  PAYGMODE: '_PAYGMODE',

    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};


// Questions
var nodes = [{ "node": 1, "message": "Do you like working with people", "yes": 2, "no": 3 },
             { "node": 2, "message": "Do you like caring for others", "yes": 4, "no": 5 },
             { "node": 3, "message": "Would you like to work during the day", "yes": 6, "no": 7 },
             { "node": 4, "message": "Can you stand the sight of blood", "yes": 8, "no": 9 },
             { "node": 5, "message": "Is money the most important thing in your life", "yes": 10, "no": 11 },
             { "node": 6, "message": "Do you want to work with animals", "yes": 12, "no": 13 },
             { "node": 7, "message": "Are you active", "yes": 14, "no": 15 },

// Answers & descriptions
             { "node": 8, "message": "Doctor", "yes": 0, "no": 0, "description": "A physician or medical doctor is a professional who practices medicine." },
             { "node": 9, "message": "Teacher", "yes": 0, "no": 0, "description": "In education, teachers facilitate student learning, often in a school or academy or perhaps in another environment such as outdoors."},
             { "node": 10, "message": "Sales person", "yes": 0, "no": 0 , "description": "A salesman is someone who works in sales, with the main function of selling products or services to others."},
             { "node": 11, "message": "Artist", "yes": 0, "no": 0 , "description": "An artist is a person engaged in one or more of any of a broad spectrum of activities related to creating art, practicing the arts, and, or demonstrating an art."},
             { "node": 12, "message": "Zookeeper", "yes": 0, "no": 0 , "description": "A zookeeper is a person who manages zoo animals that are kept in captivity for conservation or to be displayed to the public, and are usually responsible for the feeding and daily care of the animals."},
             { "node": 13, "message": "Software engineer", "yes": 0, "no": 0 , "description": "A software engineer is a person who applies the principles of software engineering to the design, development, maintenance, testing, and evaluation of the software and systems that make computers or anything containing software work."},
             { "node": 14, "message": "Security Guard", "yes": 0, "no": 0 , "description": "A security guard is a private person who is paid to protect an organization's assets from various hazards such as criminal activity, by utilizing preventative measures. "},
             { "node": 15, "message": "Lighthouse keeper", "yes": 0, "no": 0 , "description": "A lighthouse keeper is the person responsible for tending and caring for a lighthouse, particularly the light and lens in the days when oil lamps and clockwork mechanisms were used."},
            
];

// this is used for keep track of visted nodes when we test for loops in the tree
var visited;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Welcome to the Eon Alexa app, are you a direct debit customer or are you prepaid?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say direct debit or prepaid";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say direct debit or prepaid.";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "Say yes or no to answer the question.";

// This is the response to the user after the final question when Alex decides on what group choice the user should be given
var decisionMessage = "I think you would make a good";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "Say 'tell me more' to hear a short description for this profession, or do you want to play again?";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will ask you some questions that will identify what you would be best at. Want to start now?";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Ok, see you next time!";

var speechNotFoundMessage = "Could not find speech for node";

var nodeNotFoundMessage = "In nodes array could not find node";

var descriptionNotFoundMessage = "Could not find description for node";

var loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

var utteranceTellMeMore = "tell me more";

var utterancePlayAgain = "play again";

//////////

var PAYGMessage = "So you are on a prepaid tarrif. What question would you like answering?";
var PayMonthly = "So you are on a direct debit tarrif. What question would you like answering?";

var JoinEon = "No, we’ll let them know for you. To help make sure your switch goes as smoothly as possible, clear any outstanding balance with your existing supplier straight away. Is there anything else you would like to know";
var OpenPAYG = "Even though you’ve got a prepayment meter, it’s important for you to submit meter readings. We’ll contact you when we need you to send us your opening meter readings. If you don’t submit meter readings we’ll still switch your account but we’ll have to use an estimated meter reading. Is there anything else you would like to know?";
var AccRead = "It can take around three to five days to process your meter readings, so you may stay on the meter readings stage of your switch even if you’ve submitted them. We’ll update your account shortly so you don’t need to do anything. Is there anything else you would like to know?";
var debt = "You may have the option of transferring your balance over to your new supplier. If you’d like to do so please call us on 0345 301 4905 after you’ve started the process with your new supplier. Is there anything else you would like to know?";
var JoinEon = "Try to use as much of your credit as you can as you get near your start date before you begin topping up with your new electricity key or gas card from us. You can check when this should be by logging into your online account. Is there anything else you would like to know?";
var Mov = "If you've got a prepayment meter and you're moving, or if you've moved to into a home that has one of our prepayment meters, tell us your details using our prepayment meter moving home form. Is there anything else you would like to know?";
var PayCard = "If you’ve lost your payment card or key, or if you haven’t received the one we’ve sent, you can get a new one by tweeting @EONhelp , finding us on Facebook or phoning us on 0345 303 3040. Is there anything else you would like to know?";
var switchMet = "If you would like your prepayment meter removed, you will need to pass a credit check, set up a fixed Direct Debit and clear any outstanding balance. Is there anything else you would like to know?";
var top = "You can put money on your key or card at any service station or shop where you see the PayPoint or Payzone signs, or at all participating Post Offices. Is there anything else you would like to know?";
var price = "We update your prepayment meter with new charges when you put money on your key or card. We’ll send a message to your meter to update your about the new prices. This usually happens straight away, but can take up to three top-ups to show on your meter. Is there anything else you would like to know?";


/////

var probs = "If you’re getting an error message or having problems entering your readings you can contact us, find us on Facebook by searching for E.ON Energy UK or Tweet us @eonhelp. Is there anything else you would like to know?";
var rightamount = "Giving us regular meter readings will mean you'll get a better picture of your energy use and what you'll need to pay. You can use your Direct Debit Manager to keep an eye on your payments and make sure that you're on track to pay for the energy you'll use over the year. Is there anything else you would like to know?";
var creditR = "If you pay by fixed monthly Direct Debit it’s normal, for example to build up a credit over the summer months. The credit will then be used during the winter when you’re likely to use more energy. If you want a refund we’ll need to make sure you’re billed up to date, so you’ll need to provide us with an actual meter reading. You can submit your meter reading online or by calling us on 0345 052 0000. You can also get in touch on Facebook or Twitter. Please take the reading before getting in touch, as we’ll ask for this first. Is there anything else you would like to know?";
var diffDD = "Sometimes your payments won't match the amount that we've estimated you'll spend on energy over the next 12 months. This is because when we work out your payments, we don't just look at how much your energy will cost in the next year, we also have to look at your balance and any payments you're about to make and calculate how many payments we may be able to take before your next annual review, this will usually be less than 12 Is there anything else you would like to know?";
var energyU = "To work out how much energy we think you'll use until your annual review, we look at your readings - whether they're actual or estimated - to get an idea of what you've used in the last 12 months. Actual readings give us a more accurate picture of your energy use, so that's why we ask you to give us your readings every time you receive an estimated bill - see How can I give you meter readings? Is there anything else you would like to know?";
var aReview = "The annual review is when we check to make sure your payments are right for the next 12 months from the date of your review. You'll normally use more energy in the winter and less in the summer. If you pay by Monthly Direct Debit, you can spread the costs of your energy evenly over the year rather than having a high bill in winter and a low bill in summer. Is there anything else you would like to know?";
var wBill = "Please call us on 0345 301 4905, find us on Facebook by searching for E.ON Energy UK or Tweet us @eonhelp to find out about why your bill is wrong."
var bTariff = "Please call us on 0345 301 4905, find us on Facebook by searching for E.ON Energy UK or Tweet us @eonhelp for us to advise you on a better tariff."
var ChangeInfo = "Please call us on 0345 301 4905 for any changes needed on your bill."
/////

var MPAN = "The MPAN (Meter Point Administration Number) is your unique electricity reference number, and is used to identify your electricity supply. Is there anything else you would like to know?";
var KWH = "The kilowatt-hour is a derived unit of energy equal to 3.6 megajoules. If the energy is being transmitted or used at a constant rate (power) over a period of time, the total energy in kilowatt-hours is the power in kilowatts multiplied by the time in hours. Is there anything else you would like to know?"
var SmartMeter = "Meter technology has advanced considerably in recent years, new smart meters now have the capability to store and transmit customer consumption data. This prevents the necessity for inconvenient home visits or the uncertainty of estimating our customer's bills. Smart meter technology can allow customers to track their consumption online or using an in-home display, enabling them to manage their energy use more efficiently. Increased detail of usage patterns could also allow eon to control and balance our operations along the energy value chain better. Is there anything else you would like to know?"
var offPeak = "The Economy 7 cheaper rate period typically falls 7 hours between 10pm and 8.30am, but that period can vary across the country. Most variations depend on the type of meter you have, and what time of year it is (British Summer Time etc). The easiest way to find out your exact Economy 7 hours is to look at your meter. Meters can vary,  so on some meters it will tell you the hours next to the meter or on it. Is there anything else you would like to know?"

var newQuestion = "Ok, what else would you like to know?";

var promptToPayg = "You can say things like What is my MPAN number, and What's off peak?"
var promptToDD = "You can say things like What's a kilowatt-hour?, and What's a smart meter?"


var error = "error";


// the first node that we will use
var START_NODE = 1;

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, PAYGHandlers, DDHandlers, descriptionHandlers);
  // alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
  },


    'AMAZON.YesIntent': function () {
//helper.yesOrNo(this,'yes');
    this.emit(':ask', newQuestion);
    
    },


    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },


'MPAN': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', MPAN, MPAN);
},

'OffPeak': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', offPeak, offPeak);
},



    'OpeningReadings': function () {
 
        this.emit(':ask', OpenPAYG, OpenPAYG);
    },

        'JoiningEon': function () {
       
        this.emit(':ask', JoinEon, JoinEon);
    },


    'AccountReadings': function () {
      
        this.emit(':ask', AccRead, AccRead);
    },


    'EonDebt': function () {
      
        this.emit(':ask', debt, debt);
    },


    'SwitchMeter': function () {
      
        this.emit(':ask', switchMet, switchMet);
    },


    'PaymentCard': function () {
      
        this.emit(':ask', PayCard, PayCard);
    },


    'MovingHome': function () {
      
        this.emit(':ask', Mov, Mov);
    },


    'RemainingCredit': function () {
      
        this.emit(':ask', remainCred, remainCred);
    },

     'TopUp': function () {
      
        this.emit(':ask', top, top);
    },

      'PriceChange': function () {
      
        this.emit(':ask', price, price);
    },

    'KWH': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', KWH, KWH);
},

 'PriceChange': function () {
 
        this.emit(':ask', OpenPAYG, OpenPAYG);
    },

        'MeterProblems': function () {
       
        this.emit(':ask', probs, probs);
    },


    'CorrectPayment': function () {
      
        this.emit(':ask', rightamount, rightamount);
    },

   'CreditRefund': function () {
      
        this.emit(':ask', creditR, creditR);
    },


    'DifferentDD': function () {
      
        this.emit(':ask', diffDD, diffDD);
    },


    'EnergyUsage': function () {
      
        this.emit(':ask', energyU, energyU);
    },


    'AnnualReview': function () {
      
        this.emit(':ask', aReview, aReview);
    },



'SmartMeter': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', SmartMeter, SmartMeter);
},



  'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', error, error);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {

'PAYG': function ()
{

       this.handler.state = states.PAYGMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
       // this.attributes.currentNode = PAYGMODE;
        // ask the first question
        this.emit(':ask', PAYGMessage, PAYGMessage);

},

'DD': function () {

    
 this.handler.state = states.DDMODE;
 var message = helper.getSpeechForNode(START_NODE);
        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.emit(':ask', PayMonthly, PayMonthly);


},





    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];
        var loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
            // comment out this line if you know that there are no loops in your decision tree
             this.emit(':tell', loopsDetectedMessage);
        }
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.emit(':ask', message, message);
    },



    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again

var PAYGHandlers = Alexa.CreateStateHandler(states.PAYGMODE, {

'MPAN': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', MPAN, MPAN);
},

'OffPeak': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', offPeak, offPeak);
},



    'OpeningReadings': function () {
 
        this.emit(':ask', OpenPAYG, OpenPAYG);
    },

        'JoiningEon': function () {
       
        this.emit(':ask', JoinEon, JoinEon);
    },


    'AccountReadings': function () {
      
        this.emit(':ask', AccRead, AccRead);
    },

 'WrongBill': function () {
      
        this.emit(':ask', wBill, wBill);
    },


 'BetterTariff': function () {
      
        this.emit(':ask', bTariff, bTariff);
    },


 'ChangeInfo': function () {
      
        this.emit(':ask', ChangeInfo, ChangeInfo);
    },


    'EonDebt': function () {
      
        this.emit(':ask', debt, debt);
    },


    'SwitchMeter': function () {
      
        this.emit(':ask', switchMet, switchMet);
    },


    'PaymentCard': function () {
      
        this.emit(':ask', PayCard, PayCard);
    },


    'MovingHome': function () {
      
        this.emit(':ask', Mov, Mov);
    },


    'RemainingCredit': function () {
      
        this.emit(':ask', remainCred, remainCred);
    },

     'TopUp': function () {
      
        this.emit(':ask', top, top);
    },

      'PriceChange': function () {
      
        this.emit(':ask', price, price);
    },





    'AMAZON.YesIntent': function () {
//helper.yesOrNo(this,'yes');
    this.emit(':ask', newQuestion);
    
    },


    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToPayg, promptToPayg);
    }
});

var DDHandlers = Alexa.CreateStateHandler(states.DDMODE, {

    'KWH': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', KWH, KWH);
},

 'PriceChange': function () {
 
        this.emit(':ask', OpenPAYG, OpenPAYG);
    },

        'MeterProblems': function () {
       
        this.emit(':ask', probs, probs);
    },

'WrongBill': function () {
      
        this.emit(':ask', wBill, wBill);
    },


 'BetterTariff': function () {
      
        this.emit(':ask', bTariff, bTariff);
    },


 'ChangeInfo': function () {
      
        this.emit(':ask', ChangeInfo, ChangeInfo);
    },


    'CorrectPayment': function () {
      
        this.emit(':ask', rightamount, rightamount);
    },

   'CreditRefund': function () {
      
        this.emit(':ask', creditR, creditR);
    },


    'DifferentDD': function () {
      
        this.emit(':ask', diffDD, diffDD);
    },


    'EnergyUsage': function () {
      
        this.emit(':ask', energyU, energyU);
    },


    'AnnualReview': function () {
      
        this.emit(':ask', aReview, aReview);
    },



'SmartMeter': function () {
     //helper.yesOrNo(this,'yes');
        this.emit(':ask', SmartMeter, SmartMeter);
},

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        this.emit(':ask', newQuestion);
    },


    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToDD, promptToDD);
    }
});



var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.yesOrNo(this,'yes');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'DescriptionIntent': function () {
        //var reply = this.event.request.intent.slots.Description.value;
        //console.log('HEARD: ' + reply);
        helper.giveDescription(this);
      },

    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// --------------- Helper Functions  -----------------------

var helper = {

//    context.emit(':ask')

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        var description = helper.getDescriptionForNode(context.attributes.currentNode);
        var message = description + ', ' + repeatWelcomeMessage;

        context.emit(':ask', message, message);
    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        var nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = decisionMessage + ' ' + message + ' ,' + playAgainMessage;
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.emit(':ask', message, message);
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].yes === 0 && nodes[i].no === 0) {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }
                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        var yesNode = helper.getNextNode(nodeId, "yes");
        var duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        var noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};
