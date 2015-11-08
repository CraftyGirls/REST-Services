/**
 * Created by ryan on 2015-09-18.
 */

var scenarioServices = angular.module('scenarioServices', []);

scenarioServices.service('convoService', function () {
    
    function Line(){
        this.text = "";
    }
    
     function Arg(){
        this.value = "";
    }
    
    function Trigger(){
        this.func = "";
        this.args = [];
        
        this.addArg = function(){
            this.args.push(new Arg());
        }
    }
    
    function Dialogue(){
        this.lines    = [];
        this.triggers = [];
        
        this.addLine = function(){
            this.lines.push(new Line());
        };
        
        this.addTrigger = function(){
            this.triggers.push(new Trigger());
        }
    }
    
    function Conversation(id, name){
        this.id = id;
        this.name = name;
        this.dialogues = [];
        
        this.addDialogue = function(){
            this.dialogues.push(new Dialogue());
        };
    
    }
    
    var convoData = [];

    var currConversation = null;

    return {
        conversations: function () {
            return convoData;
        },
       setData: function(convos){
          convoData = convos;
        },
        addConversation: function () {
            var id = 0; 
            if(convoData.length > 0){
                id = convoData[convoData.length - 1].id;
            }
            convoData.push(new Conversation(id, 'Conversation ' + convoData.length));
        },
        editConversation: function (convo) {
            currConversation = convo;
        },
        deleteConversation: function (convo) {
            convoData.splice(convoData.indexOf(convo), 1);
        },
        addDialogue : function(){
            currConversation.addDialogue();
        },
        addLine : function(dialogue){
            dialogue.addLine()
        },
        getCurrentCovnversation : function(){
            return currConversation;
        },
        addTrigger : function(dialogue){
            dialogue.addTrigger();
        },
        addArg : function(trigger){
            trigger.addArg();
        }
    };
});

scenarioServices.service('charService', function () {
    var charData = [];

    var charId = 0;

    var currChar = 0;

    return {
        chars: function () {
            return charData;
        },
        setData: function(chars){
          charData = chars;
        },
        addChar: function () {
            charId++;
            charData.push({'id': charId, 'name': '', 'states': []});
        },
        deleteChar: function (character) {
            charData.splice(charData.indexOf(character), 1);
        },
        editChar: function (character) {
            currChar = character.id;
        },
        getCurrChar: function () {
            return currChar;
        },
        addStateToChar: function (character, id) {
            charData[charData.indexOf(character)].states.push({'id': id, 'name': '', 'convoId': 0});
        },
        getStatesLength: function (character) {
            return charData[charData.indexOf(character)].states.length;
        }
    };
});

scenarioServices.service('lineService', function () {
    var lineData = [
        {'id': 0, 'character': '', 'text': ''}
    ];

    var currLine = 0;

    return {
        lines: function () {
            return lineData;
        },
        addLine: function () {
            currLine++;
            lineData.push({'id': currLine, 'character': '', text: ''});
        },
        deleteLine: function (character) {
            lineData.splice(lineData.indexOf(character), 1);
        }
    };
});