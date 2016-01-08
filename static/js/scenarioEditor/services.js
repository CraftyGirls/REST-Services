/**
 * Created by ryan on 2015-09-18.
 */

function Line() {
    this.text = "";

    this.validate = function () {
        var errorMessages = [];
        if (this.text == null || this.text.length <= 0) {
            errorMessages.push("Line does not have text specified");
        }
        return errorMessages;
    };
}

Line.BuildFromData = function (data) {
    var line = new Line();
    line.text = data.text;
    return line;
};

function Arg() {
} // Object properties are not constant

Arg.BuildFromData = function (data) {
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

    this.addArg = function (key, type) {
        this.args[key] = {value: null, type: type};
    };

    this.validate = function () {
        var errorMessages = [];

        if (this.func == null || this.func.length <= 0) {
            errorMessages.push("Trigger must have a valid function name");
        }

        var argFields = Object.getOwnPropertyNames(this.args);
        for (var i = 0; i < argFields.length; i++) {
            if (this.args[argFields[i]].value == null || this.args[argFields[i]].value.toString().length <= 0) {
                errorMessages.push(this.func + " -> " + " Argument '" + argFields[i] + "' does not have a value specified");
            }
        }
        return errorMessages;
    };
}

Trigger.BuildFromData = function (data) {
    var trig = new Trigger();
    trig.func = data.func;
    trig.args = Arg.BuildFromData(data.args);
    return trig;
};

function Dialogue(name) {
    this.lines = [];
    this.triggers = [];
    this.conditions = [];
    this.speaker = "";
    this.name = name;

    this.addLine = function () {
        this.lines.push(new Line());
    };

    this.addTrigger = function () {
        this.triggers.push(new Trigger());
    };

    this.addCondition = function () {
        this.conditions.push(new Trigger());
    };

    this.validate = function () {
        var errorMessages = [];

        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("Dialogue must have a name");
        }

        if (this.speaker == null || this.speaker.toString().length <= 0) {
            errorMessages.push("Dialogues -> " + this.name + " is missing a speaker");
        }

        var childErrors = [];

        for (var i = 0; i < this.lines.length; i++) {
            var errors = this.lines[i].validate();
            for (var x = 0; x < errors.length; x++) {
                errors[x] = " Lines -> Line[" + x + "] -> " + errors[x];
            }
            childErrors = childErrors.concat(errors);
        }

        for (var i = 0; i < this.triggers.length; i++) {
            var errors = this.triggers[i].validate();
            for (var x = 0; x < errors.length; x++) {
                errors[x] = " Triggers -> " + errors[x];
            }
            childErrors = childErrors.concat(errors);
        }

        for (var i = 0; i < this.conditions.length; i++) {
            var errors = this.conditions[i].validate();
            for (var x = 0; x < errors.length; x++) {
                errors[x] = " Conditions -> " + errors[x];
            }
            childErrors = childErrors.concat(errors);
        }

        for (var i = 0; i < childErrors.length; i++) {
            childErrors[i] = this.name + " -> " + childErrors[i];
        }

        errorMessages = errorMessages.concat(childErrors);

        return errorMessages;
    }
}

Dialogue.BuildFromData = function (data) {
    var diag = new Dialogue();

    for (var i = 0; i < data.lines.length; i++) {
        diag.lines.push(Line.BuildFromData(data.lines[i]));
    }

    for (var i = 0; i < data.triggers.length; i++) {
        diag.triggers.push(Trigger.BuildFromData(data.triggers[i]));
    }

    for (var i = 0; i < data.conditions.length; i++) {
        diag.conditions.push(Trigger.BuildFromData(data.conditions[i]));
    }

    diag.speaker = data.speaker;
    diag.name = data.name;

    return diag;
};


function Option(convoId, label) {
    this.convoId = convoId;
    this.label = label;

    this.validate = function () {
        var errorMessages = [];

        var label = this.label.length > 0 ? this.label : "(blank)";

        if (this.convoId == null || this.convoId.toString().length <= 0) {
            errorMessages.push("Option " + label + " does not have a valid conversation selected");
        }

        return errorMessages;
    };
}

Option.BuildFromData = function (data) {
    return new Option(data.convoId, data.label);
};


function Conversation(id, name) {
    this.id = id;
    this.name = name;
    this.dialogues = [];
    this.options = [];

    this.addDialogue = function () {
        this.dialogues.push(new Dialogue("Dialogue " + this.dialogues.length));
    };

    this.addOption = function (convoId, label) {
        this.options.push(new Option(convoId, label))
    };

    this.validate = function () {
        var errorMessages = [];
        var childMessages = [];

        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("Conversation does not have a name specified")
        }

        for (var i = 0; i < this.dialogues.length; i++) {
            childMessages = childMessages.concat(this.dialogues[i].validate());
        }

        for (var i = 0; i < this.options.length; i++) {
            childMessages = childMessages.concat(this.options[i].validate());
        }

        for (var i = 0; i < childMessages.length; i++) {
            childMessages[i] = this.name + " -> " + childMessages[i]
        }

        errorMessages = errorMessages.concat(childMessages);

        return errorMessages;
    };

}

Conversation.BuildFromData = function (data) {
    var convo = new Conversation(data.id, data.name);
    for (var i = 0; i < data.dialogues.length; i++) {
        convo.dialogues.push(Dialogue.BuildFromData(data.dialogues[i]));
    }
    for (var i = 0; i < data.options.length; i++) {
        convo.addOption(data.options[i].convoId, data.options[i].label);
    }
    return convo;
};

function State(id, name) {
    this.id = id;
    this.name = name;
    this.convo = null;

    this.validate = function(){
        var errorMessages = [];
        if(this.name == null || this.name.length <= 0){
            errorMessages.push("State name must be specified")
        }
        if(this.convo == null || this.convo.toString().length <= 0){
            errorMessages.push("State must have a valid conversation selected");
        }
        return errorMessages;
    }
}

State.BuildFromData = function (data) {
    var state = new State(data.id, data.name);
    state.convo = data.convo;
    return state;
};

function Character(id, name) {
    this.id = id;
    this.name = name;
    this.states = [];
    this.components = {};

    this.addState = function (state) {
        var stateId = 0;
        for (var i = 0; i < this.states.length; i++) {
            stateId = Math.max(stateId, this.states[i].id);
        }
        stateId++;
        this.states.push(new State(stateId, ""));
    };

    this.validate = function () {
        var errorMessages = [];
        var childMessages = [];

        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("Name must be specified");
        } else {
            for (var i = 0; i < this.states.length; i++) {
                var errors = this.states[i].validate();
                for(var x = 0; x < errors.length; x++){
                    errors[x] = this.name + " -> States -> " + this.states[i].name + " -> " + errors[x];
                }
                childMessages = childMessages.concat(errors);
            }
           // @TODO Do we need component validation? - No components should result in a random character
        }
        errorMessages = errorMessages.concat(childMessages);
        return errorMessages;
    }
}

Character.BuildFromData = function (data) {
    var char = new Character(data.id, data.name);
    for (var i = 0; i < data.states.length; i++) {
        char.states.push(data.states[i]);
    }
    char.components = data.components;
    return char;
};

function Item(name, id) {
    this.name = name;
    this.id = id;
    this.interactable = true;
    this.description = "";
    this.texture = "";
    this.effects = [];

    this.validate = function(){
        var errorMessages = [];
        if(this.name == null || this.name.length <= 0){
            errorMessages.push("Item name must be specified");
        }
        if(this.description == null || this.description.length <= 0){
            errorMessages.push(this.name + " is missing a description");
        }
        // @TODO is a texture required?
        for(var i = 0; i < this.effects.length; i++){
            var errors = this.effects[i].validate();
            for(var x = 0; x < errors.length; x++){
                errors[x] = this.name + " -> Effects -> " + errors[x];
            }
            errorMessages = errorMessages.concat(errors);
        }
        return errorMessages;
    }
}

Item.BuildFromData = function (data) {
    var item = new Item();
    item.name = data.name;
    item.id = data.id;
    item.interactable = data.interactable;
    item.description = data.description;
    item.texture = data.texture;
    for (var i = 0; i < data.effects.length; i++) {
        item.effects.push(Trigger.BuildFromData(data.effects[i]));
    }
    return item;
};

const ROOM_SIZES = ["Small", "Medium", "Large"];

function Room(name, id) {
    this.name = name;
    this.id = id;
    this.description = "";
    this.furnitureTypes = [];
    this.characters = [];
    this.items = [];
    this.tags = [];
    this.size = ROOM_SIZES[0];

    this.validate = function(){
        var errorMessages = [];

        if(this.name == null || this.name.length <= 0){
            errorMessages.push("Room must have a name");
        }

        if(this.description == null || this.description.length <= 0){
            errorMessages.push(this.name + " is missing a description");
        }

        return errorMessages;
    }
}

Room.BuildFromData = function (data) {
    var room = new Room();
    room.name = data.name;
    room.id = data.id;
    room.description = data.description;
    room.furnitureTypes = data.furnitureTypes;
    room.items = data.items;
    room.characters = data.characters;
    room.tags = data.tags;
    room.size = data.size;
    return room;
};


// Resource Models

var TRIGGER_ARG_DATA_TYPES = [
    "STRING",
    "INT",
    "FLOAT",
    "CHARACTER",
    "ITEM",
    "ROOM",
    "CONVERSATION"
];

function TriggerResource() {
    this.func = "";
    this.description = "";
    this.id = -1;
    this.args = [];
}

TriggerResource.BuildFromData = function (data) {
    var trigger = new TriggerResource();
    trigger.func = data.func;
    trigger.description = data.description;
    trigger.id = data.id;
    for (var i = 0; i < data.args.length; i++) {
        trigger.args.push(TriggerArgumentResource.BuildFromData(data.args[i]));
    }
    return trigger;
};

function TriggerArgumentResource() {
    this.dataType = "";
    this.field = "";
    this.id = -1;
}

TriggerArgumentResource.BuildFromData = function (data) {
    var arg = new TriggerArgumentResource();
    arg.dataType = data.dataType;
    arg.field = data.field;
    arg.id = data.id;
    return arg;
};

// Services

var scenarioServices = angular.module('scenarioServices', []);

scenarioServices.service('convoService', function () {

    var convoData = [];

    var currConversation = null;
    var currId = 1;

    return {
        conversations: function () {
            return convoData;
        },
        setData: function (convos) {
            for (var i = 0; i < convos.length; i++) {
                convoData.push(Conversation.BuildFromData(convos[i]));
                currId = Math.max(currId, convos[i].id);
            }
        },
        addConversation: function () {
            var id = 0;
            for (var i = 0; i < convoData.length; i++) {
                id = Math.max(id, convoData[i].id);
            }
            id += 1;
            convoData.push(new Conversation(id, 'Conversation ' + id));

        },
        editConversation: function (convo) {
            currConversation = convo;
        },
        deleteConversation: function (convo) {
            var idx = convoData.indexOf(convo);
            if (idx != -1) {
                convoData.splice(idx, 1);
            }
        },
        addDialogue: function () {
            currConversation.addDialogue();
        },
        addLine: function (dialogue) {
            dialogue.addLine();
        },
        getCurrentCovnversation: function () {
            return currConversation;
        },
        addTrigger: function (dialogue) {
            dialogue.addTrigger();
        },
        addTriggerArg: function (trigger) {
            trigger.addArg();
        },
        addConditionArg: function (condition) {
            condition.addArg();
        },
        addCondition: function (dialogue) {
            dialogue.addCondition();
        },
        addOption: function (convoId, label) {
            currConversation.addOption(convoId, label)
        }
    };
});

scenarioServices.service('charService', function () {
    // The characters
    var charData = [];

    // The id to use for the next character that is created
    // The value is used then incremented
    var currId = 0;

    // The character currently being edited
    var currChar = null;

    return {
        chars: function () {
            return charData;
        },
        setData: function (chars) {
            for (var i = 0; i < chars.length; i++) {
                charData.push(Character.BuildFromData(chars[i]));
                // Find the highest saved ID
                currId = Math.max(currId, chars[i].id);
            }
            // Increment it at the end for use when adding a new character
            currId++;
        },
        addChar: function () {
            charData.push(new Character(currId, ""));
            currId++;
        },
        deleteChar: function (character) {
            charData.splice(charData.indexOf(character), 1);
        },
        editChar: function (character) {
            currChar = character;
        },
        getCurrChar: function () {
            return currChar;
        },
        addStateToChar: function (character) {
            character.addState();
        },
        getStatesLength: function (character) {
            return charData[charData.indexOf(character)].states.length;
        },
        getById: function (id) {
            for (var i = 0; i < charData.length; i++) {
                if (charData[i].id === id) {
                    return charData[i];
                }
            }
            return null;
        },
        getIds: function () {
            ids = [];
            for (var i = 0; i < charData.length; i++) {
                ids.push(charData[i].id);
            }
            return ids;
        }
    };
});

scenarioServices.service('itemService', function () {
    var itemData = [];
    var currItem = null;

    function getNextId() {
        var id = 0;
        for (var i = 0; i < itemData.length; i++) {
            id = Math.max(itemData[i].id, id);
        }
        id++;
        return id;
    }

    return {
        items: function () {
            return itemData;
        },
        addItem: function () {
            var id = getNextId();
            itemData.push(new Item("Item" + id, id));
        },
        editItem: function (item) {
            currItem = item;
        },
        setData: function (data) {
            for (var i = 0; i < data.length; i++) {
                itemData.push(Item.BuildFromData(data[i]));
            }
        },
        addEffect: function (item) {
            item.effects.push(new Trigger());
        },
        getCurrentItem: function () {
            return currItem;
        },
        getById: function (id) {
            for (var i = 0; i < itemData.length; i++) {
                if (itemData[i].id === id) {
                    return itemData[i];
                }
            }
            return null;
        },
        getIds: function () {
            ids = [];
            for (var i = 0; i < itemData.length; i++) {
                ids.push(itemData[i].id);
            }
            return ids;
        }
    };
});

scenarioServices.service('roomService', function () {
    var roomData = [];
    var currRoom = null;

    function getNextId() {
        var id = 0;
        for (var i = 0; i < roomData.length; i++) {
            id = Math.max(roomData[i].id, id);
        }
        id++;
        return id;
    }

    return {
        rooms: function () {
            return roomData;
        },
        addRoom: function () {
            var id = getNextId();
            roomData.push(new Room("Room" + id, id));
        },
        editRoom: function (room) {
            currRoom = room;
        },
        setData: function (data) {
            for (var i = 0; i < data.length; i++) {
                roomData.push(Room.BuildFromData(data[i]));
            }
        },
        getCurrentRoom: function () {
            return currRoom;
        },
        getRooms: function () {
            return roomData;
        },
        getRoomSizeOptions: function () {
            return ROOM_SIZES;
        }
    };
});

scenarioServices.service('triggerService', ['$http', function ($http) {

    triggers = [];

    function _fetchTriggers(onComplete) {
        $http.get('/scenario/service/trigger').then(
            // Success
            function (response) {
                triggers = [];
                for (var i = 0; i < response.data.length; i++) {
                    triggers.push(TriggerResource.BuildFromData(response.data[i]));
                }
                if (onComplete != null) {
                    onComplete();
                }
            },
            // Failure
            function (response) {
                if (onComplete != null) {
                    onComplete();
                }
            }
        )
    }

    return {
        triggers: function () {
            return triggers;
        },
        dataTypes: function () {
            return TRIGGER_ARG_DATA_TYPES;
        },
        fetchTriggers: function (onComplete) {
            _fetchTriggers(onComplete);
        },
        createTrigger: function (triggerResource) {
            $http.put('/scenario/service/trigger/', triggerResource).then(
                // Success
                function (response) {
                    _fetchTriggers(null);
                },
                // Failure
                function (response) {
                }
            )
        },
        updateTrigger: function (triggerResource) {
            $http.post('/scenario/service/trigger/' + triggerResource.id + "/", triggerResource).then(
                // Success
                function (response) {
                    _fetchTriggers(null);
                },
                // Failure
                function (response) {
                }
            )
        },
        deleteTrigger: function (triggerResource) {
            $http.delete('/scenario/service/trigger/' + triggerResource.id + "/").then(
                // Success
                function (response) {
                    _fetchTriggers(null);
                },
                // Failure
                function (response) {
                }
            )
        }
    }
}]);