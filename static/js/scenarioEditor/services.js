

function Texture() {
    this.id = 0;
    this.src = "";
    this.imageUrl = "";
    this.type = "texture";
}

function Tags() {
    this.not = [];
    this.required = [];
    this.preferred = [];
}

Tags.BuildFromData = function (data) {

    var tag = new Tags();
    tag.not = data.not;
    tag.required = data.required;
    tag.preferred = data.preferred;
    return tag;
};


function Line() {
    this.text = "";

    this.validate = function () {
        var errorMessages = [];
        if (this.text === null || this.text.length <= 0) {
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
        
        if (!data[key].hasOwnProperty('dependsOn')) {
            data[key]['dependsOn'] = "NONE";
        }

        if (data.hasOwnProperty(key)) {
            arg[key] = data[key];
        }
    }
    return arg;
};

function Trigger() {

    this.type = "";
    this.args = new Arg();
    this.id = -1;

    this.addArg = function (key, type, dependsOn) {
        this.args[key] = {value: null, type: type, dependsOn: dependsOn};
    };

    this.validate = function () {
        var errorMessages = [];

        if (this.type == null || this.type.length <= 0) {
            errorMessages.push("Trigger must have a valid function name");
        }

        var argFields = Object.getOwnPropertyNames(this.args);
        for (var i = 0; i < argFields.length; i++) {
            if (this.args[argFields[i]].value == null || this.args[argFields[i]].value.toString().length <= 0) {
                errorMessages.push(this.type + " -> " + " Argument '" + argFields[i] + "' does not have a value specified");
            }
        }
        return errorMessages;
    };
}

Trigger.BuildFromData = function (data) {
    var trig = new Trigger();
    trig.type = data.type;
    trig.args = Arg.BuildFromData(data.args);
    if (data.hasOwnProperty('id')) {
        trig.id = data.id;
    }
    return trig;
};

function Dialogue(name) {
    this.text = [];
    this.triggers = [];
    this.conditions = [];
    this.speaker = "";
    this.name = name;

    this.addLine = function () {
        this.text.push("");
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

        for (var i = 0; i < this.text.length; i++) {
            errors = [];
            if (this.text[i] == null || this.text[i].length <= 0) {
                errors.push(" Text -> Text[" + i + "] -> Text does not have text specified");
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

    for (var i = 0; i < data.text.length; i++) {
        diag.text.push(data.text[i]);
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
    this.dialogue = [];
    this.options = [];
    this.type = "conversation";
    this.settings = {
        indentation : 0
    };

    this.addDialogue = function () {
        this.dialogue.push(new Dialogue("Dialogue " + this.dialogue.length));
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

        for (var i = 0; i < this.dialogue.length; i++) {
            childMessages = childMessages.concat(this.dialogue[i].validate());
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
    for (var i = 0; i < data.dialogue.length; i++) {
        convo.dialogue.push(Dialogue.BuildFromData(data.dialogue[i]));
    }
    for (var i = 0; i < data.options.length; i++) {
        convo.addOption(data.options[i].convoId, data.options[i].label);
    }
    if(data.hasOwnProperty('settings')){
        convo.settings = data.settings;
    }
    return convo;
};

function State(id, name) {
    this.id = id;
    this.name = name;
    this.convo = null;
    this.animation = "RANDOM";

    this.validate = function () {
        var errorMessages = [];
        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("State name must be specified")
        }
        return errorMessages;
    }
}

State.BuildFromData = function (data) {
    var state = new State(data.id, data.name);
    state.convo = data.convo;
    if(data.hasOwnProperty('animation')){
        state.animation = data.animation;
    }
    return state;
};

function Character(id, name) {
    this.id = id;
    this.name = name;
    this.states = [];
    this.items = [];
    this.type = "character";
    this.defaultState = -1;
    this.strength = 0;
    this.sass     = 0;
    this.insight  = 0;
    this.defense  = 0;
    this.components = [{
        tags: new Tags(),
        src: "", // Pelvis
        components: [
            {
                tags: new Tags(),
                src: "", // Torso
                components: [
                    {
                        tags: new Tags(),
                        src: "" // Head
                    },
                    {
                        tags: new Tags(),
                        src: "" // Left Arm
                    },
                    {
                        tags: new Tags(),
                        src: "" // Right Arm
                    }
                ]
            },
            {
                tags: new Tags(),
                src: "" // Left Leg
            },
            {
                tags: new Tags(),
                src: "" // Right Leg
            }
        ]
    }];

    this.addState = function (state) {
        var stateId = 0;
        for (var i = 0; i < this.states.length; i++) {
            stateId = Math.max(stateId, this.states[i].id);
        }
        stateId++;
        if (this.id > 0) {
            this.states.push(new State(stateId, this.states.length == 0 ? "DefaultState" : "state" + stateId));
            if (this.states.length == 1) {
                this.defaultState = stateId;
            }
        }
    };

    this.validate = function () {
        var errorMessages = [];
        var childMessages = [];

        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("Name must be specified");
        } else {
            for (var i = 0; i < this.states.length; i++) {
                var errors = this.states[i].validate();
                for (var x = 0; x < errors.length; x++) {
                    errors[x] = this.name + " -> States -> " + this.states[i].name + " -> " + errors[x];
                }
                childMessages = childMessages.concat(errors);
            }
            // @TODO Do we need component validation? - No components should result in a random character
        }
        errorMessages = errorMessages.concat(childMessages);
        return errorMessages;
    };

    this.getComponentForType = function (type) {
        // return this.components;
        switch (type) {
            case "PELVIS":
                return this.components[0];

            case "TORSO":
                return this.components[0].components[0];

            case "HEAD":
                return this.components[0].components[0].components[0];

            case "LEFT_ARM":
                return this.components[0].components[0].components[1];

            case "RIGHT_ARM":
                return this.components[0].components[0].components[2];

            case "LEFT_LEG":
                return this.components[0].components[1];

            case "RIGHT_LEG":
                return this.components[0].components[2];
        }
        return null;
    };

    // Create deafault state
    this.addState();
}

Character.BuildFromData = function (data) {
    var char = new Character(data.id, data.name);
    char.states = [];

    for (var i = 0; i < data.states.length; i++) {
        char.states.push(State.BuildFromData(data.states[i]));
    }

    if (char.states.length == 0) {
        char.addState();
    }
    
    char.sass = data.sass || 0;
    char.defense = data.defense || 0;
    char.strength = data.strength || 0;
    char.insight = data.insight || 0;
    char.items = data.items;
    char.components = data.components;
    char.defaultState = data.defaultState;
    char.getComponentForType("PELVIS").tags = Tags.BuildFromData(data.components[0].tags);
    char.getComponentForType("TORSO").tags = Tags.BuildFromData(data.components[0].components[0].tags);
    char.getComponentForType("HEAD").tags = Tags.BuildFromData(data.components[0].components[0].components[0].tags);
    char.getComponentForType("LEFT_ARM").tags = Tags.BuildFromData(data.components[0].components[0].components[1].tags);
    char.getComponentForType("RIGHT_ARM").tags = Tags.BuildFromData(data.components[0].components[0].components[2].tags);
    char.getComponentForType("LEFT_LEG").tags = Tags.BuildFromData(data.components[0].components[1].tags);
    char.getComponentForType("RIGHT_LEG").tags = Tags.BuildFromData(data.components[0].components[2].tags);

    return char;
};

function Item(name, id) {
    this.name = name;
    this.id = id;
    this.collectable  = true;
    this.pixelPerfect = true;
    this.consumable   = true;
    this.description  = "";
    this.texture = -1;
    this.effects = [];
    this.pickupEffects = [];
    this.type = "item";

    this.validate = function () {
        var errorMessages = [];
        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("Item name must be specified");
        }
        if (this.description == null || this.description.length <= 0) {
            errorMessages.push(this.name + " is missing a description");
        }
        // @TODO is a texture required?
        for (var i = 0; i < this.effects.length; i++) {
            var errors = this.effects[i].validate();
            for (var x = 0; x < errors.length; x++) {
                errors[x] = this.name + " -> Effects -> " + errors[x];
            }
            errorMessages = errorMessages.concat(errors);
        }
        for (var i = 0; i < this.pickupEffects.length; i++) {
            var errors = this.pickupEffects[i].validate();
            for (var x = 0; x < errors.length; x++) {
                errors[x] = this.name + " -> Pickup Effects -> " + errors[x];
            }
            errorMessages = errorMessages.concat(errors);
        }
        return errorMessages;
    };
}

Item.BuildFromData = function (data) {
    var item = new Item();
    item.name = data.name;
    item.id = data.id;
    item.pixelPerfect = data.pixelPerfect;
    item.collectable  = data.collectable;
    item.description  = data.description;
    if(data.hasOwnProperty('consumable')){
        item.consumable = data.consumable;
    }
    item.texture = data.texture;
    for (var i = 0; i < data.effects.length; i++) {
        item.effects.push(Trigger.BuildFromData(data.effects[i]));
    }
    if (data.hasOwnProperty("pickupEffects")) {
        for (var i = 0; i < data.pickupEffects.length; i++) {
            item.pickupEffects.push(Trigger.BuildFromData(data.pickupEffects[i]));
        }
    }
    return item;
};

const ROOM_TYPES = {
    RANDOM     : ["MEDIUM"],
    BATHROOM   : ["SMALL"],
    LIVINGROOM : ["MEDIUM", "LARGE"],
    KITCHEN    : ["MEDIUM"],
    OFFICE     : ["SMALL", "MEDIUM"],
    LABORATORY : ["MEDIUM"]
} 

function Room(name, id) {
    this.name = name;
    this.id = id;
    this.description = "";
    this.furnitureTypes = "RANDOM";
    this.characters = [];
    this.tags = new Tags();
    this.size = "MEDIUM"
    this.type = "room";
    this.locked = false;
    this.items = [];
    this.triggersOnce = [];
    this.triggersMulti = [];

    this.validate = function () {
        var errorMessages = [];

        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("Room must have a name");
        }

        if (this.description == null || this.description.length <= 0) {
            errorMessages.push(this.name + " is missing a description");
        }
        for (var i = 0; i < this.triggersOnce.length; i++) {
            var errors = this.triggersOnce[i].validate();
            for (var x = 0; x < errors.length; x++) {
                errors[x] = " Triggers -> " + errors[x];
            }
            errorMessages.concat(errors);
        }
        for (var i = 0; i < this.triggersMulti.length; i++) {
            var errors = this.triggersMulti[i].validate();
            for (var x = 0; x < errors.length; x++) {
                errors[x] = " Triggers -> " + errors[x];
            }
            errorMessages.concat(errors);
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
    if(!room.furnitureTypes.length > 0){
        room.furnitureTypes = "RANDOM";
    }
    room.items = data.items;
    room.characters = data.characters;
    room.size = data.size;
    room.locked = data.locked;
    room.tags = Tags.BuildFromData(data.tags);
    if(data.hasOwnProperty("triggersOnce")){
        for(var i=0; i < data.triggersOnce.length; i++){
            room.triggersOnce.push(Trigger.BuildFromData(data.triggersOnce[i]));
        }
    }
    if(data.hasOwnProperty("triggersMulti")){
        for(var i=0; i < data.triggersMulti.length; i++){
            room.triggersMulti.push(Trigger.BuildFromData(data.triggersMulti[i]));
        }
    }
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
    "CONVERSATION",
    "CHARACTER_STATE"
];

var SCENARIO_TYPES = {
    Side		: 0,
	Omar        : 1,
	Plot		: 2
};

var SCENARIO_ORDER = {
    Random       : 0,
    Beginning    : 1,
    Middle_One   : 2,
    Middle_Two   : 3,
    Middle_Three : 4,
    End          : 5
};

function TriggerResource() {
    this.type = "";
    this.description = "";
    this.id = -1;
    this.args = [];
    this.condition = false;
}

TriggerResource.BuildFromData = function (data) {
    var trigger = new TriggerResource();
    trigger.type = data.type;
    trigger.description = data.description;
    trigger.id = data.id;
    for (var i = 0; i < data.args.length; i++) {
        trigger.args.push(TriggerArgumentResource.BuildFromData(data.args[i]));
    }
    if(data.hasOwnProperty("condition")){
        trigger.condition = data.condition;
    }
    return trigger;
};

function TriggerArgumentResource() {
    this.dataType = "STRING";
    this.field = "";
    this.id = -1;
    this.dependsOn = "NONE";
}

TriggerArgumentResource.BuildFromData = function (data) {
    var arg = new TriggerArgumentResource();
    arg.dataType = data.dataType.toUpperCase();
    arg.field = data.field;
    arg.id = data.id;
    arg.dependsOn = data.dependsOn;
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
        },
        resetCurrent : function () {
            currConversation = null;
        }
    };
});

scenarioServices.service('charService', [function () {

    // The characters
    var charData = [];

    // The character currently being edited
    var currChar = null;

    return {
        chars: function () {
            return charData;
        },
        setData: function (chars) {
            if (chars.length == 0) {
                charData.push(new Character(0, "Player"));
            }
            for (var i = 0; i < chars.length; i++) {
                charData.push(Character.BuildFromData(chars[i]));
            }

        },
        addChar: function () {
            var id = 0;
            for (var i = 0; i < charData.length; i++) {
                id = Math.max(id, charData[i].id);
            }
            id += 1;
            charData.push(new Character(id, "character" + id));
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
        },
        setComponentSourceForType: function (char, type, src) {
            if (type.length > 0) {
                var s = src.split("master/");
                char.getComponentForType(type).src = s.length > 1 ? s[1] : s[0];
            }
        }
    };
}]);

scenarioServices.service('itemService', ['roomService', 'charService', function (roomService, charService) {
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

    function _getById(id) {
        for (var i = 0; i < itemData.length; i++) {
            if (itemData[i].id === id) {
                return itemData[i];
            }
        }
        return null;
    }

    function _getIds() {
        ids = [];
        for (var i = 0; i < itemData.length; i++) {
            ids.push(itemData[i].id);
        }
        return ids;
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
            return _getById(id);
        },
        getIds: function () {
            return _getIds();
        },
        getUnusedItems: function () {
            var allIds = _getIds();
            var usedIds = [];
            for (var i = 0; i < roomService.getRooms().length; i++) {
                for (var j = 0; j < roomService.getRooms()[i].items.length; j++) {
                    usedIds.push(roomService.getRooms()[i].items[j]);
                }
            }
            for (var i = 0; i < charService.chars().length; i++) {
                for (var j = 0; j < charService.chars()[i].items.length; j++) {
                    usedIds.push(charService.chars()[i].items[j]);
                }
            }
            for (var x = 0; x < usedIds.length; x++) {
                var idx = allIds.indexOf(usedIds[x]);
                allIds.splice(idx, 1);
            }
            var items = [];
            for (var c = 0; c < allIds.length; c++) {
                items.push(_getById(allIds[c]));
            }
            return items;
        },
        resetCurrent: function () {
            currItem = null;
        }
    };
}]);

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
            currRoom = roomData.indexOf(room);
        },
        setData: function (data) {
            for (var i = 0; i < data.length; i++) {
                roomData.push(Room.BuildFromData(data[i]));
            }
        },
        getCurrentRoom: function () {
            return roomData[currRoom];
        },
        getRooms: function () {
            return roomData;
        },
        getRoomTypeOptions: function () {
            return ROOM_TYPES;
        }
    };
});

scenarioServices.service('triggerService', ['$http', function ($http) {

    var _triggers = [];

    function _fetchTriggers(onComplete) {
        $http.get('/scenario/service/trigger').then(
            // Success
            function (response) {
                _triggers = [];
                for (var i = 0; i < response.data.length; i++) {
                    _triggers.push(TriggerResource.BuildFromData(response.data[i]));
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
            return _triggers;
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
        },
        validateLocalTrigger: function (localTrigger, ownerContainer) {
            var errors = [];
            var found = false;
            for (var i = 0; i < _triggers.length; i++) {
                if (_triggers[i].id == localTrigger.id) {
                    found = true;
                }
            }
            if (!found) {
                errors.push("Effect " + localTrigger.type + " no longer exists. The effect has been removed");
                ownerContainer.splice(ownerContainer.indexOf(localTrigger), 1);
                return errors;
            }
            for (var i = 0; i < _triggers.length; i++) {
                if (_triggers[i].id == localTrigger.id) {
                    for (var j = 0; j < _triggers[i].args.length; j++) {
                        var key = _triggers[i].args[j].field;
                        if (!localTrigger.args.hasOwnProperty(key)) {
                            errors.push("Effect " + localTrigger.type + " is missing argument " + key +
                                ". Please update this effect");
                            localTrigger.args[key] = new Arg();
                            localTrigger.args[key]['value'] = null;
                            localTrigger.args[key]['type'] = _triggers[i].args[j].dataType;
                            ocalTrigger.args[key]['dependsOn'] =  _triggers[i].args[j].dependsOn;
                        } else {
                            if (localTrigger.args[key].type != _triggers[i].args[j].dataType) {
                                errors.push("The data type of field " + key + " has been altered for effect "
                                    + localTrigger.type + ". Please update the value of this argument");
                                localTrigger.args[key].value = null;
                                localTrigger.args[key].type = _triggers[i].args[j].dataType;
                                localTrigger.args[key].dependsOn =  _triggers[i].args[j].dependsOn;
                            }
                        }
                    }
                }
            }
            triggerIArgs = {};
            for (var i = 0; i < _triggers.length; i++) {
                if (_triggers[i].id == localTrigger.id) {
                    triggerIArgs = {};
                    for (var j = 0; j < _triggers[i].args.length; j++) {
                        triggerIArgs[_triggers[i].args[j].field] = "";
                    }
                }
            }
            for (key in localTrigger.args) {
                if (!triggerIArgs.hasOwnProperty(key)) {
                    errors.push("Effect " + localTrigger.type + " has additional incorrect field " + key +
                        ". An attempt has been made to resolve this error. Please verify this correction");
                    delete localTrigger.args[key];
                }
            }
            return errors;
        },
        assignIdByName: function (trigger) {
            var d = function () {
                for (var i = 0; i < _triggers.length; i++) {
                    if (_triggers[i].type == trigger.type) {
                        trigger.id = _triggers[i].id;
                        break;
                    }
                }
            };
            if (_triggers.length == 0) {
                _fetchTriggers(function () {
                    d();
                });
            } else {
                d();
            }
        }
    }
}]);

scenarioServices.service('scenarioService', function () {

    var scenario = {};

    return {
        setData: function (data) {
            scenario.name = data.name;
            scenario.description = data.name;
            if(data.hasOwnProperty("type")){
                scenario.type = data.type;
            }else{
                scenario.type = SCENARIO_TYPES.Side;
            }
            if(data.hasOwnProperty("order")){
                scenario.order = data.order;
            }else{
                scenario.order = SCENARIO_ORDER.Random;
            }
        },
        scenario: function () {
            return scenario;
        }
    }
});

scenarioServices.service('textureService', ['$http', '$q', function ($http, $q) {

    var textures = [];

    function _fetchTextureById(id) {
        return $q(function (success, failure) {
            $http.get('/scenario/service/texture/' + id).then(
                // Success
                function (response) {
                    var texture = new Texture();
                    texture.id = response.data.id;
                    texture.src = response.data.src;
                    texture.imageUrl = response.data.imageUrl;
                    if (textures.indexOf(texture) == -1) {
                        textures.push(texture);
                    }
                    success(texture);
                },
                // Failure
                function (response) {
                    failure(response);
                }
            );
        });
    }

    function _getTextureById(id) {
        return $q(function (success, failure) {
            for (var i = 0; i < textures.length; i++) {
                if (textures[i].id == id) {
                    success(textures[i]);
                    return;
                }
            }
            _fetchTextureById(id).then(
                function (texture) {
                    success(texture);
                },
                function (response) {
                    failure(response);
                }
            )
        });
    }

    return {
        textures: function () {
            return textures;
        },
        getTextureById: function (id) {
            return _getTextureById(id);
        },
        setTextures: function (tex) {
            textures = tex;
        }

    };
}]);

scenarioServices.service('jointService', ['textureService', '$q', '$http', function (textureService, $q, $http) {

    joints = [];

    function _getNextId() {
        var id = 0;
        for (var i = 0; i < joints.length; i++) {
            id = Math.max(id, joints[i].id);
        }
        return ++id;
    }

    return {
        joints: function () {
            return joints;
        },
        getJoint: function (jointSrc) {
            return $q(function (success, fail) {
                if (jointSrc == null || jointSrc == "" || jointSrc == undefined) {
                    fail(null);
                    return;
                }
                for (var j = 0; j < joints.length; j++) {
                    if (joints[j].src == jointSrc) {
                        success(joints);
                    }
                }
                var path = jointSrc.split("/master");
                path = path.length > 1 ? path[1] : path[0];
                console.log(path);
                $http.get('/scenario/service/gitlab_asset/', {
                    params: {
                        asset: path
                    }
                }).then(
                    function (response) {
                        var newJoint = {
                            textures: [],
                            id: _getNextId()
                        };
                        for (var i = 0; i < response.data.textures.length; i++) {
                            newJoint.textures.push(response.data.textures[i]);
                        }
                        joints.push(newJoint);
                        success(newJoint);
                    },
                    function (response) {
                        fail(response);
                    }
                );
            });
        }
    }
}])
