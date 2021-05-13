"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-includes */
/* eslint-disable @typescript-eslint/no-for-in-array */
var core = require('@actions/core');
var github = require('@actions/github');
var fs = require('fs');
function createMessage(pytestResult, subtitle) {
    var file = fs.readFileSync(pytestResult);
    var newString = new String(file);
    var lineOfText = newString.split('\n');
    var startKey = '0';
    var newMessage = '### :white_check_mark: Result of Pytest Coverage\n ' + subtitle;
    var lastMessage = '';
    var delLine = '';
    for (var i in lineOfText) {
        if (lineOfText[i].indexOf('coverage: platform') >= 0) {
            startKey = i;
            newMessage += "\n" + lineOfText[i] + "\n";
            delete lineOfText[i];
            var iNext = parseInt(i) + 1;
            delLine = iNext.toString();
            newMessage +=
                '| Name | Stmts | Miss | Cover |\n| :--- | ----: | ---: | ----: |\n';
        }
        if (i === delLine) {
            delete lineOfText[i];
        }
        if (startKey !== '0' && lineOfText[i] !== undefined) {
            if (lineOfText[i].indexOf('---------------------------------------------------------') >= 0) {
                delete lineOfText[i];
            }
            else if (lineOfText[i].indexOf('passed in') >= 0) {
                lastMessage += "\n~" + lineOfText[i].replace(/=/g, '') + "~";
                delete lineOfText[i];
            }
            if (lineOfText[i] !== undefined) {
                var tabOfText = lineOfText[i].split(/\s+/);
                for (var t in tabOfText) {
                    if (tabOfText[t] !== '') {
                        tabOfText[t] = "| " + tabOfText[t];
                    }
                    else {
                        delete tabOfText[t];
                    }
                }
                if (tabOfText[3] !== undefined) {
                    newMessage += tabOfText[0] + tabOfText[1] + tabOfText[2] + tabOfText[3] + "|\n";
                }
            }
        }
    }
    return newMessage + lastMessage;
}
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var githubToken, pytestFileName, update_comment, subtitle, message, context, pullRequestNumber, octokit, comments, comment;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (github.context.eventName !== 'pull_request') {
                        core.info('Comment only will be created on pull requests!');
                        return [2 /*return*/];
                    }
                    githubToken = core.getInput('token');
                    pytestFileName = core.getInput('pytest-coverage');
                    update_comment = core.getInput('update_comment');
                    subtitle = core.getInput('subtitle');
                    message = createMessage(pytestFileName, subtitle);
                    context = github.context;
                    pullRequestNumber = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number;
                    octokit = github.getOctokit(githubToken);
                    return [4 /*yield*/, octokit.issues.listComments(__assign(__assign({}, context.repo), { issue_number: pullRequestNumber !== null && pullRequestNumber !== void 0 ? pullRequestNumber : 0 }))];
                case 1:
                    comments = (_b.sent()).data;
                    comment = comments.find(function (comment) {
                        return (comment.user.login === 'github-actions[bot]' &&
                            comment.body.startsWith('### :white_check_mark: Result of Pytest Coverage ' + subtitle));
                    });
                    if (!(comment && update_comment.toLowerCase() == 'true')) return [3 /*break*/, 3];
                    return [4 /*yield*/, octokit.issues.updateComment(__assign(__assign({}, context.repo), { comment_id: comment.id, body: message }))];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, octokit.issues.createComment(__assign(__assign({}, context.repo), { issue_number: pullRequestNumber !== null && pullRequestNumber !== void 0 ? pullRequestNumber : 0, body: message }))];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// eslint-disable-next-line github/no-then
run().catch(function (error) { return core.setFailed("Workflow failed! " + error.message); });
