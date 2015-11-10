/**
 * Created by ryan on 2015-09-18.
 */

var scenarioServices = angular.module('scenarioServices', []);

scenarioServices.service('convoService', function () {
    
    var convoData = [];

    var currConversation = null;
    var currId = 0;
    
    function Line(){
        this.text = "";
    }
    
    Line.BuildFromData = function(data){
        var line = new Line();
        line.text = data.text;
        return line;
    };
    
    function Arg(){
        this.value = "";
    }
    
    Arg.BuildFromData = function(data){
        var arg = new Arg();
        arg.value = data.value;
        return arg;
    };
    
    function Trigger(){
        this.func = "";
        this.args = [];
        
        this.addArg = function(){
            this.args.push(new Arg());
        };
    }
    
    Trigger.BuildFromData = function(data){
        var trig = new Trigger();
        trig.func = data.func;
        for(var i =0; i < data.args.length; i++){
            trig.args.push(Arg.BuildFromData(data.args[i]));
        }
        return trig;
    };
    
    function Condition(){
        this.func = "";
        this.args = [];
        
        this.addArg = function(){
            this.args.push(new Arg());
        };
    }
    
    Condition.BuildFromData = function(data){
        var cond = new Condition();
        cond.func = data.func;
        for(var i = 0; i < data.args.length; i++){
            cond.args.push(Arg.BuildFromData(data.args[i]));
        }
        return cond;
    };
    
    function Dialogue(name){
        this.lines      = [];
        this.triggers   = [];
        this.conditions = [];
        this.speaker    = "";
        this.name       = name;
        
        this.addLine = function(){
            this.lines.push(new Line());
        };
        
        this.addTrigger = function(){
            this.triggers.push(new Trigger());
        };
        
        this.addCondition = function(){
            this.conditions.push(new Condition());
        };
    }
    
    Dialogue.BuildFromData = function(data){
        var diag = new Dialogue();
       
        for(var i = 0; i < data.lines.length; i++){
            diag.lines.push(Line.BuildFromData(data.lines[i]));
        }
        
        for(var i = 0; i < data.triggers.length; i++){
             diag.triggers.push(Trigger.BuildFromData(data.triggers[i]));
        }
        
        for(var i = 0; i < data.conditions.length; i++){
             diag.conditions.push(Condition.BuildFromData(data.conditions[i]));
        }
        
        diag.speaker = data.speaker;
        diag.name    = data.name;
        
        return diag;
    };
    
    function Conversation(id, name){
        this.id = id;
        this.name = name;
        this.dialogues = [];
        
        this.addDialogue = function(){
            this.dialogues.push(new Dialogue("Dialogue " + this.dialogues.length));
        };
        
    }
    
    Conversation.BuildFromData = function(data){
        var convo = new Conversation(data.id, data.name);
        for(var i = 0; i < data.dialogues.length; i++){
            convo.dialogues.push(Dialogue.BuildFromData(data.dialogues[i]));
        }
        return convo;
    }

    return {
        conversations: function () {
            return convoData;
        },
       setData: function(convos){
          for(var i = 0; i < convos.length; i++){
              convoData.push(Conversation.BuildFromData(convos[i]));
              currId = Math.max(currId, convos[i].id);
          }
          currId++;
        },
        addConversation: function () {
            var id = currId; 
            if(convoData.length > 0){
                id = convoData.length;
            }
            convoData.push(new Conversation(id, 'Conversation ' + convoData.length));
            currId++;
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
            dialogue.addLine();
        },
        getCurrentCovnversation : function(){
            return currConversation;
        },
        addTrigger : function(dialogue){
            dialogue.addTrigger();
        },
        addTriggerArg : function(trigger){
            trigger.addArg();
        },
        addConditionArg : function(condition){
            condition.addArg();
        },
        addCondition : function(dialogue){
            dialogue.addCondition();
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