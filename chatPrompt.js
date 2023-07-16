const express = require('express');
require('dotenv').config()
const app = express();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const {
    TextServiceClient,
    DiscussServiceClient
} = require("@google-ai/generativelanguage");
const {
    GoogleAuth
} = require("google-auth-library");
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const API_KEY = process.env.API_KEY;
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});
const context = "";
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const examples = [{
    "input": {
        "content": "Hello"
    },
    "output": {
        "content": "Hello! How can I help you today?"
    }
}];
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const messages = [];
const candidates = [];
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/', (req, res) => {
    messages.push({
        "content": req.query.question
    });
    //console.log(messages);
    client.generateMessage({
        // REQUIRED, WHICH MODEL TO USE TO GENERATE THE RESULT
        model: 'models/chat-bison-001',
        // OPTIONAL, 0.0 ALWAYS USES THE HIGHEST-PROBABILITY RESULT
        temperature: 0.25,
        // OPTIONAL, HOW MANY CANDIDATE RESULTS TO GENERATE
        candidateCount: 1,
        // OPTIONAL, NUMBER OF MOST PROBABLE TOKENS TO CONSIDER FOR GENERATION
        top_k: 40,
        // OPTIONAL, FOR NUCLEUS SAMPLING DECODING STRATEGY
        top_p: 0.95,
        prompt: {
            // OPTIONAL, SENT ON EVERY REQUEST AND PRIORITIZED OVER HISTORY
            //context: context,
            // OPTIONAL, EXAMPLES TO FURTHER FINETUNE RESPONSES
            //examples: examples,
            // REQUIRED, ALTERNATING PROMPT/RESPONSE MESSAGES
            messages: messages,
        },
    }).then(result => {
        //console.log(JSON.stringify(result, null, 2));
        result.forEach(function(d1) {
            if (d1 != null) {
                d1.candidates.forEach(function(d2) {
                    candidates.push({
                        "AIReply": d2.content
                    });
                    console.log("Message", messages);
                    console.log("Candidates", candidates);
                })
            }
        })
    });
})
app.listen(3000, () => {
    console.log('Example app listening on port 3000')
})