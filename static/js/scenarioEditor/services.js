/**
 * Created by ryan on 2015-09-18.
 */

var scenarioServices = angular.module('scenarioServices', []);

scenarioServices.service('convoService', function () {
    var convoData = [
        {'id': 0, 'name': 'Conversation 0'}
    ];

    var currConversation = 0;

    return {
        conversations: function () {
            return convoData;
        },
        addConversation: function () {
            currConversation++;
            convoData.push({'id': currConversation, 'name': 'Conversation ' + currConversation});
        },
        editConversation: function (convo) {
            //TODO: Make this work
        },
        deleteConversation: function (convo) {
            convoData.splice(convoData.indexOf(convo), 1);
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