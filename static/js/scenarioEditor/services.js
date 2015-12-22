/**
 * Created by ryan on 2015-09-18.
 */

var scenarioServices = angular.module('scenarioServices', []);

scenarioServices.service('convoService', function() {

    var convoData = [];

    var currConversation = null;
    var currId = 1;

    function Line() {
        this.text = "";
    }

    Line.BuildFromData = function(data) {
        var line = new Line();
        line.text = data.text;
        return line;
    };

    function Arg() {} // Object properties are not constant

    Arg.BuildFromData = function(data) {
        var arg = new Arg();
        // The key values of an arg are not set so we iterate through the stored 
        // data object to determine what they are
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                arg[key] = data[key];
            }
        }

        return arg;
    };

    function Trigger() {
        
        this.func = "";
        this.args = new Arg();

        this.addArg = function() {
            var id = 0;
            while(this.args.hasOwnProperty("key" + id)){
                id++;
            }
            this.args["key" + id] = "value";
        };
    }

    Trigger.BuildFromData = function(data) {
        var trig = new Trigger();
        trig.func = data.func;
        trig.args = Arg.BuildFromData(data.args);
        return trig;
    };

    function Condition() {
        this.func = "";
        this.args = new Arg();

         this.addArg = function() {
            var id = 0;
            while(this.args.hasOwnProperty("key" + id)){
                id++;
            }
            this.args["key" + id++] = "value";
        };
    }

    Condition.BuildFromData = function(data) {
        var cond = new Condition();
        cond.func = data.func;
        cond.args = Arg.BuildFromData(data.args);
        return cond;
    };

    function Dialogue(name) {
        this.lines = [];
        this.triggers = [];
        this.conditions = [];
        this.speaker = "";
        this.name = name;

        this.addLine = function() {
            this.lines.push(new Line());
        };

        this.addTrigger = function() {
            this.triggers.push(new Trigger());
        };

        this.addCondition = function() {
            this.conditions.push(new Condition());
        };
    }

    Dialogue.BuildFromData = function(data) {
        var diag = new Dialogue();

        for (var i = 0; i < data.lines.length; i++) {
            diag.lines.push(Line.BuildFromData(data.lines[i]));
        }

        for (var i = 0; i < data.triggers.length; i++) {
            diag.triggers.push(Trigger.BuildFromData(data.triggers[i]));
        }

        for (var i = 0; i < data.conditions.length; i++) {
            diag.conditions.push(Condition.BuildFromData(data.conditions[i]));
        }

        diag.speaker = data.speaker;
        diag.name = data.name;

        return diag;
    };

    function Option(convoId, label) {
        this.convoId = convoId;
        this.label = label;
    }

    Option.BuildFromData = function(data) {
        return new Option(data.convoId, data.label);
    };

    function Conversation(id, name) {
        this.id = id;
        this.name = name;
        this.dialogues = [];
        this.options = [];

        this.addDialogue = function() {
            this.dialogues.push(new Dialogue("Dialogue " + this.dialogues.length));
        };

        this.addOption = function(convoId, label) {
            this.options.push(new Option(convoId, label))
        }
    }

    Conversation.BuildFromData = function(data) {
        var convo = new Conversation(data.id, data.name);
        for (var i = 0; i < data.dialogues.length; i++) {
            convo.dialogues.push(Dialogue.BuildFromData(data.dialogues[i]));
        }
        for (var i = 0; i < data.options.length; i++) {
            convo.addOption(data.options[i].convoId, data.options[i].label);
        }
        return convo;
    }

    return {
        conversations: function() {
            return convoData;
        },
        setData: function(convos) {
            for (var i = 0; i < convos.length; i++) {
                convoData.push(Conversation.BuildFromData(convos[i]));
                currId = Math.max(currId, convos[i].id);
            }
            currId += 1;
            console.log(currId);
        },
        addConversation: function() {
            var id = currId;
            if (convoData.length > 0) {
                id = convoData.length + 1;
            }
            convoData.push(new Conversation(id, 'Conversation ' + id));
            currId++;
        },
        editConversation: function(convo) {
            currConversation = convo;
        },
        deleteConversation: function(convo) {
            var idx = convoData.indexOf(convo);
            if (idx != -1) {
                convoData.splice(idx, 1);
            }
        },
        addDialogue: function() {
            currConversation.addDialogue();
        },
        addLine: function(dialogue) {
            dialogue.addLine();
        },
        getCurrentCovnversation: function() {
            return currConversation;
        },
        addTrigger: function(dialogue) {
            dialogue.addTrigger();
        },
        addTriggerArg: function(trigger) {
            trigger.addArg();
        },
        addConditionArg: function(condition) {
            condition.addArg();
        },
        addCondition: function(dialogue) {
            dialogue.addCondition();
        },
        addOption: function(convoId, label) {
            currConversation.addOption(convoId, label)
        }
    };
});

scenarioServices.service('charService', function() {
    // The characters
    var charData = [];

    // The id to use for the next character that is created
    // The value is used then incremented
    var currId = 0;

    // The character currently being edited
    var currChar = null;

    function State(id, name) {
        this.id = id;
        this.name = name;
    }

    State.BuildFromData = function(data) {
        var state = new State(data.id, data.name);
        return state;
    }

    function Character(id, name) {
        this.id = id;
        this.name = name;
        this.states = [];

        this.addState = function(state) {
            var stateId = 0;
            for (var i = 0; i < this.states.length; i++) {
                stateId = Math.max(stateId, this.states[i].id);
            }
            stateId++;
            this.states.push(new State(stateId, ""));
        }
    }

    Character.BuildFromData = function(data) {
        var char = new Character(data.id, data.name);
        for (var i = 0; i < data.states.length; i++) {
            char.states.push(data.states[i]);
        }
        return char;
    }

    return {
        chars: function() {
            return charData;
        },
        setData: function(chars) {
            for (var i = 0; i < chars.length; i++) {
                charData.push(Character.BuildFromData(chars[i]));
                // Find the highest saved ID
                currId = Math.max(currId, chars[i].id);
            }
            // Increment it at the end for use when adding a new character
            currId++;
        },
        addChar: function() {
            charData.push(new Character(currId, ""));
            currId++;
        },
        deleteChar: function(character) {
            charData.splice(charData.indexOf(character), 1);
        },
        editChar: function(character) {
            currChar = character;
        },
        getCurrChar: function() {
            return currChar;
        },
        addStateToChar: function(character) {
            character.addState();
        },
        getStatesLength: function(character) {
            return charData[charData.indexOf(character)].states.length;
        }
    };
});

scenarioServices.service('lineService', function() {
    var lineData = [{
        'id': 0,
        'character': '',
        'text': ''
    }];

    var currLine = 0;

    return {
        lines: function() {
            return lineData;
        },
        addLine: function() {
            currLine++;
            lineData.push({
                'id': currLine,
                'character': '',
                text: ''
            });
        },
        deleteLine: function(character) {
            lineData.splice(lineData.indexOf(character), 1);
        }
    };
});

scenarioServices.service('itemService', function() {
    var itemData = [];
    var currItem = null;

    function Item(name, id){
        this.name = name;
        this.id = id;
    }

    Item.BuildFromData = function(data){
        var item = new Item();
        item.name = data.name;
        item.id = data.id;
        return item;
    }

    function getNextId(){
        var id = 0;
        for(var i = 0; i < itemData.length; i++){
            id = Math.max(itemData[i].id, id);
        }
        id++;
        return id;
    }

    return {
        items: function() {
            return itemData;
        },
        addItem: function(){
            var id = getNextId();
            itemData.push(new Item("Item" + id, id));
        },
        editItem: function(item){
            currItem = item;
        },
        setData: function(data){
            for(var i = 0; i < data.length; i++){
                itemData.push(Item.BuildFromData(data[i]));
            }
        }
    };
});

scenarioServices.service('roomService', function() {
    var roomData = [];
    var currRoom = null;

    function Room(name, id){
        this.name = name;
        this.id = id;
    }

    Room.BuildFromData = function(data){
        var room = new Room();
        room.name = data.name;
        room.id = data.id;
        return room;
    }

    function getNextId(){
        var id = 0;
        for(var i = 0; i < roomData.length; i++){
            id = Math.max(roomData[i].id, id);
        }
        id++;
        return id;
    }

    return {
        rooms: function() {
            return roomData;
        },
        addRoom: function(){
            var id = getNextId();
            roomData.push(new Room("Room" + id, id));
        },
        editRoom: function(room){
            currRoom = room;
        },
        setData: function(data){
            for(var i = 0; i < data.length; i++){
                roomData.push(Room.BuildFromData(data[i]));
            }
        }
    };
});