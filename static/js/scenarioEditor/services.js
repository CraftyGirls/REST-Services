/**
 * Created by ryan on 2015-09-18.
 */


function Texture() {
    this.id = 0;
    this.src = "";
    this.imageUrl = "";
    this.type = "texture";
}

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

    this.type = "";
    this.args = new Arg();

    this.addArg = function (key, type) {
        this.args[key] = {value: null, type: type};
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
    return convo;
};

function State(id, name) {
    this.id = id;
    this.name = name;
    this.convo = null;

    this.validate = function () {
        var errorMessages = [];
        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("State name must be specified")
        }
        if (this.convo == null || this.convo.toString().length <= 0) {
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
    this.items = [];
    this.type = "character";
    this.defaultState = -1;
    this.components = [{
        src: "", // Pelvis
        components: [
            {
                src: "", // Torso
                components: [
                    {
                        src: "" // Head
                    },
                    {
                        src: "" // Left Arm
                    },
                    {
                        src: "" // Right Arm
                    }
                ]
            },
            {
                src: "" // Left Leg
            },
            {
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
        if (this.id > 0){
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
    if(char.states.length == 0){
        char.addState();
    }
    char.items = data.items;
    char.components = data.components;
    char.defaultState = data.defaultState;
    return char;
};

function Item(name, id) {
    this.name = name;
    this.id = id;
    this.collectable = true;
    this.pixelPerfect = true;
    this.description = "";
    this.texture = -1;
    this.effects = [];
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
        return errorMessages;
    };
}

Item.BuildFromData = function (data) {
    var item = new Item();
    item.name = data.name;
    item.id = data.id;
    item.pixelPerfect = data.pixelPerfect;
    item.collectable = data.collectable;
    item.description = data.description;
    console.log(data.texture);
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
    this.type = "room";
    this.locked = false;

    this.validate = function () {
        var errorMessages = [];

        if (this.name == null || this.name.length <= 0) {
            errorMessages.push("Room must have a name");
        }

        if (this.description == null || this.description.length <= 0) {
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
    room.locked = data.locked;
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
    this.type = "";
    this.description = "";
    this.id = -1;
    this.args = [];
}

TriggerResource.BuildFromData = function (data) {
    var trigger = new TriggerResource();
    trigger.type = data.type;
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
                char.getComponentForType(type).src = s.length > 0 ? s[1] : s[0];
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

scenarioServices.service('scenarioService', function () {

    var scenario = {};

    return {
        setData: function (data) {
            scenario.name = data.name;
            scenario.description = data.name;
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
}]);