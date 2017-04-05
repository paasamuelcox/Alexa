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
        var counter = 0;
        var maxnumber = 2;
        // This is the intial welcome message
       // var welcomeMessage = "Welcome to the Eon Alexa app, what question would you like answering?";
            var welcomeMessage = "Hello Allan. Welcome to the EON Alexa app. To hear a summary of your account say ‘summary’ or ask me a question.";


        // This is the message that is repeated if the response to the initial welcome message is not heard
        var promptToStartMessage = "Please say Summary for an account summary, or ask a question";
        var repeatWelcomeMessage = "Please say Summary for an account summary, or ask a question";

        // this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
        //var promptToStartMessage = "You can say things like What's a kilowatt-hour?, and What's a smart meter";

        // This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
        //var promptToSayYesNo = "Say yes or no to answer the question.";

        // This is the response to the user after the final question when Alex decides on what group choice the user should be given
        //var decisionMessage = "I think you would make a good";

        // This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
        //var playAgainMessage = "Say 'tell me more' to hear a short description for this profession, or do you want to play again?";

        // this is the help message during the setup at the beginning of the game
        //var helpMessage = "I will ask you some questions that will identify what you would be best at. Want to start now?";

        // This is the goodbye message when the user has asked to quit the game
        var goodbyeMessage = "Ok! Let’s talk again soon!";

        //var speechNotFoundMessage = "Could not find speech for node";

        //var nodeNotFoundMessage = "In nodes array could not find node";

        //var descriptionNotFoundMessage = "Could not find description for node";

        //var loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

        //var utteranceTellMeMore = "tell me more";

        //var utterancePlayAgain = "play again";

        //////////

        var PAYGMessage = "So you are on a prepaid tarrif. What question would you like answering? ";
        var PayMonthly = "So you are on a direct debit tarrif. What question would you like answering? ";

        var JoinEon = "No, EON will let your existing supplier know you’re switching. But to help your switch go smoothly you should clear any outstanding balance with your existing supplier. ";
        var OpenPAYG = "Don’t worry, EON will contact you when they need your opening meter readings. It can take around three to five days to process your readings. ";
        var AccRead = "If you’ve already submitted your meter readings but your account is still saying you need to submit them, it can take around three to five days before your account is updated. ";
        var debt = "You may be able to transfer your balance from eon to your new account. You will need to start the process with your new supplier before you contact us. ";
       // var JoinEon = "If you still have credit with your old supplier, try to use as much as you can, before your start date with EON. ";
        var Mov = "If you’re moving house, you can send EON your new details using an online form. Find the prepayment meter moving home form on EON’s website: eonenergy.com. ";
        var PayCard = "It’s easy to get a new payment card. Just tweet EON at EON help or find them on Facebook to request a new payment card. ";
        var switchMet = "Yes, you can switch from a prepayment meter to a credit meter. To get a prepayment meter removed, you will need to pass a credit check, set up a fixed Direct Debit, and clear any outstanding balance. ";
        var top = "You can top up your prepayment key or card at any service station, shop, or Post Office. Just look out for the PayPoint or Payzone signs. ";
        var price = "If EON changes their prices they will update your prepayment meter when you next put money on your key or card. You’ll also get a message sent to your meter updating you about the new prices. ";


        /////
        var probs = "If you’re having problems entering your meter readings you can contact EON on Facebook at EON Energy UK or on Twitter at eon help. ";
        var rightamount = "You’ll have a better idea of your energy use and energy payments if you give regular meter readings. Use your Direct Debit Manager to keep an eye on your payments. ";
        var creditR = "If you pay by fixed monthly Direct Debit, it’s normal to be in credit. Instead of a refund you can use your credit in the winter when you’re likely to use more energy. ";
        var diffDD = "If your Direct Debit doesn’t match your estimation, don’t worry. EON calculates your estimation by looking at your current balance including any payments you’re about to make, and how many payments they can take before your next annual review. If you’re left with credit, you can use it up or have a refund. ";
        var energyU = "EON calculates an energy estimation from all your readings from the past 12 months. Actual readings are more accurate, so whenever you receive an estimated bill you need to take a reading. ";
        var aReview = "In an annual review, EON decides if your payments for the next 12 months need to change. If they need to update your Direct Debit they will send you a schedule of your new payment. ";
        var wBill = "There are a few reasons why your bill might be wrong. In order to help, EON needs to find out more about your account. Search EON Energy UK on Facebook, or Tweet at eon help. "
        var bTariff = "You can get advice on finding a better tariff with EON. Search for EON Energy UK on Facebook or Tweet at eon help. "
        var ChangeInfo = "If you need to change any information on your energy bill you can login to EON.com. "
        /////
    //not changed text
        var MPAN = "MPAN stands for Meter Point Administration Number. It’s your unique electricity reference number, and is used to identify your electricity supply. ";
        var KWH = "The kilowatt-hour is a unit of energy equal to 3.6 megajoules. A kilowatt-hour is calculated by the total power in kilowatts multiplied by the total time in hours. ";
        var SmartMeter = "A smart meter is an electricity and gas meter which can digitally send meter readings to your energy supplier every month. Eon’s self-reading smart meters show you exactly how much energy you’re using. ";
        var offPeak = "Off-Peak times are when your electricity is cheaper to use. If you have an Economy 7 meter your off-peak period is usually for 7 hours between 10pm and 8.30am. ";
        var meterreading = "The quickest way to submit a meter reading is through your online account. Go to eonenergy.com to log in or register online. ";

        var newQuestion = "Ok, what else would you like to know? ";
        var newQuestion2 = "Can I help with somethng else? ";
    // end
        var dontUnderstand = "If you don’t understand your bill, it may have changed if you have recently sent corrected readings. Is there a specific question you have about your bill? ";
        var estimatedBill = "If your bill is estimated you should read your meter and send EON a meter reading. If you manage your account online you can log in and create your own bill, using your actual readings. ";
        var currentPrices = "You’ll find your current prices on your latest energy bill. You can view your bills online by logging into your account or registering at eonenergy.com. ";
        var discount = "Discounts are now available on all EON tariffs. If you pay by fixed monthly Direct Debit you will get £35 off your bill per year. And if you’re a dual fuel customer, that’s £35 off electricity and £35 off gas. ";
        var moreReadings = "Your bill might have more than one set of readings if there's been a change to your energy prices, or if you've switched energy products since your last bill. ";

        var prompt =  ["You can ask: What's a kilowatt hour? Or: What's a smart meter?", "- Why don’t you ask: what's an Annual Review? Or: can I have a refund on my credit?", "Ask a question like: when is my next bill due? Or: when did I give my last meter reading? "]
       var nextQuestion =  ["Can I help you with anything else?", "Is there anything else I can help with?", "Do you have another question? "]

        var lastBillPaid = "Your last bill was £86 and was paid on the 20th of Feburary. ";
        var nextBill = "Your next bill is due on the 19th of Feburary. To make sure your next bill is accurate, take a meter reading within the 5 days before the 10th of May. ";
        var LatestReading = "Your last meter reading was taken on the 15th of January. Your Electricity reading was 40052. Your Gas reading was 12439. ";
        var remainCred = "If you still have credit with your old supplier, try to use as much as you can, before your start date with EON. "

        var error = "I didn't hear what you said. Please try again. ";
        var summary = "You're currently on our on demand service. Your last bill was £86 and was paid on the 20th of February. Your next bill is due on the 10th of May. Your last meter reading was taken on the 15th of January. Do you have any questions? ";

        var joinEon2 = "We're delighted you want to join us. Please head to eonengery.com to become a customer. ";

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
         //   this.handler.state = states.STARTMODE;
            this.emit(':ask', welcomeMessage,promptToStartMessage);
          
          },


            'AMAZON.YesIntent': function () {
                   if (counter > maxnumber) {
           counter = 0;
        }
        //helper.yesOrNo(this,'yes');
            this.emit(':ask', newQuestion, prompt[counter]);
             counter++;
            
            },

            'AMAZON.NoIntent': function () {
                // Handle No intent.
                this.emit(':tell', goodbyeMessage);
                counter = 0;
            },

            ///

                   'JoinEON': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', joinEon2, prompt[counter]);
                counter++;
        },

            'DontUnderstand': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', dontUnderstand, prompt[counter]);
                counter++;
        },

        'meterreading': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', meterreading + nextQuestion[counter], prompt[counter]);
                counter++;
        },

        'EstimatedBill': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', estimatedBill + nextQuestion[counter], prompt[counter]);
                counter++;
        },

        'CurrentPrices': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', currentPrices + nextQuestion[counter], prompt[counter]);
                counter++;
        },

        'Discount': function () {
          if (counter > maxnumber) {
           counter = 0;
        }
             //helper.yesOrNo(this,'yes');
                this.emit(':ask', discount + nextQuestion[counter], prompt[counter]);
                counter++;
        },


        'summary': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', summary, prompt[counter]);
                counter++;
        },

        'ReadingSet': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', moreReadings + nextQuestion[counter], prompt[counter]);
                counter++;
        },

        'LastBill': function () {
          if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', lastBillPaid + nextQuestion[counter], prompt[counter]);
                counter++;
        },

        'NextBill': function () {
              if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', nextBill + nextQuestion[counter], prompt[counter]);
                counter++;
        },

        'LastReading': function () {
              if (counter > maxnumber) {
           counter = 0;
        }

             //helper.yesOrNo(this,'yes');
                this.emit(':ask', LatestReading + nextQuestion[counter], prompt[counter]);
                counter++;
        },

         'WrongBill': function () {

              if (counter > maxnumber) {
           counter = 0;
        }      
                this.emit(':ask', wBill + nextQuestion[counter], prompt[counter]);
                counter++;
            },


         'BetterTariff': function () {

              if (counter > maxnumber) {
           counter = 0;
        }      
                this.emit(':ask', bTariff + nextQuestion[counter], prompt[counter]);
                counter++;
            },


         'ChangeInfo': function () {

             if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', ChangeInfo + nextQuestion[counter], prompt[counter]);
                 counter++;
            },
        ///

        'MPAN': function () {

             if (counter > maxnumber) {
           counter = 0;
        }      
             //helper.yesOrNo(this,'yes');
                this.emit(':ask', MPAN + nextQuestion[counter], prompt[counter]);
                 counter++;
        },

        'OffPeak': function () {

             if (counter > maxnumber) {
           counter = 0;
        }      
             //helper.yesOrNo(this,'yes');
                this.emit(':ask', offPeak + nextQuestion[counter], prompt[counter]);
                 counter++;
        },

        'OpeningReadings': function () {

             if (counter > maxnumber) {
           counter = 0;
        }      
         
                this.emit(':ask', OpenPAYG + nextQuestion[counter], prompt[counter]);
                 counter++;
            },

                'JoiningEon': function () {

                     if (counter > maxnumber) {
           counter = 0;
        }      
               
                this.emit(':ask', JoinEon + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'AccountReadings': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', AccRead + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'EonDebt': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', debt + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'SwitchMeter': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', switchMet + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'PaymentCard': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', PayCard + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'MovingHome': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', Mov + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'RemainingCredit': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }
              
                this.emit(':ask', remainCred + nextQuestion[counter], prompt[counter]);
                 counter++;
            },



             'TopUp': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', top + nextQuestion[counter], prompt[counter]);
                 counter++;
            },

              'PriceChange': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', price + nextQuestion[counter], prompt[counter]);
                 counter++;
            },

            'KWH': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
             //helper.yesOrNo(this,'yes');
                this.emit(':ask', KWH + nextQuestion[counter], prompt[counter]);
                 counter++;
        },

         'PriceChange': function () {

             if (counter > maxnumber) {
           counter = 0;
        }      
         
                this.emit(':ask', OpenPAYG + nextQuestion[counter], prompt[counter]);
                 counter++;
            },

                'MeterProblems': function () {

                     if (counter > maxnumber) {
           counter = 0;
        }      
               
                this.emit(':ask', probs + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'CorrectPayment': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', rightamount + nextQuestion[counter], prompt[counter]);
                 counter++;
            },

           'CreditRefund': function () {

             if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', creditR + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'DifferentDD': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', diffDD + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'EnergyUsage': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', energyU + nextQuestion[counter], prompt[counter]);
                 counter++;
            },


            'AnnualReview': function () {

                 if (counter > maxnumber) {
           counter = 0;
        }      
              
                this.emit(':ask', aReview + nextQuestion[counter], prompt[counter]);
                 counter++;
            },

        'SmartMeter': function () {

             if (counter > maxnumber) {
           counter = 0;
        }      
             //helper.yesOrNo(this,'yes');
                this.emit(':ask', SmartMeter + nextQuestion[counter], prompt[counter]);
                 counter++;
        },


          'AMAZON.HelpIntent': function () {
           // this.handler.state = states.STARTMODE;
            this.emit(':ask', helpMessage, helpMessage);
          },
          'Unhandled': function () {
             if (counter > maxnumber) {
           counter = 0;
        }      
           // this.handler.state = states.STARTMODE;
            this.emit(':ask', error, prompt[counter]);
             counter++;
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
