const { followerModel } = require("../model/followerModel");
const { followingModel } = require("../model/followingModel");
const userModel = require("../model/userModel");

async function sendRequest(req, res) {
    try {
        let { uid, followId } = req.body;
        let doc = await userModel.find({ _id: followId }).exec();
        console.log(doc);
        let allReadyPresentInFollowingModel = await followingModel.find({ uid: uid, followId: followId }).exec();
        console.log(allReadyPresentInFollowingModel);
        if (allReadyPresentInFollowingModel[0] == null) {
            if (doc[0].isPublic) {
                await followingModel.create({
                    uid,
                    followId
                })
                await followerModel.create({
                    uid: followId,
                    followerId: uid
                })
                res.json({
                    message: "Request Sent and Accepted",
                })
            } else {
                await followingModel.create({
                    uid,
                    followId,
                    isAccepted: false
                })
                res.json({
                    message: "Request Sent and Pending"
                })
            }

        } else {
            if (!(followId == allReadyPresentInFollowingModel[0].followId)) {
                if (doc[0].isPublic) {
                    await followingModel.create({
                        uid,
                        followId
                    })
                    await followerModel.create({
                        uid: followId,
                        followerId: uid
                    })
                    res.json({
                        message: "Request Sent and Accepted",
                    })
                } else {
                    await followingModel.create({
                        uid,
                        followId,
                        isAccepted: false
                    })
                    res.json({
                        message: "Request Sent and Pending"
                    })
                }
            } else {
                res.json({
                    message: "Request Already Sent"
                })
            }
        }

    }
    catch (error) {
        res.json({
            message: "Failed to Send Request",
            error
        })
    }
}
async function acceptRequest(req, res) {
    try {
        let { uid, toBeAccepted } = req.body;
        let doc = await followingModel.find({ followId: uid }).exec();
        doc[0].isAccepted = true;
        await followerModel.create({
            uid: uid,
            followerId: toBeAccepted
        })
        res.json({
            message: "Request Accepted Successfully"
        })
    }
    catch (error) {
        res.json({
            message: "Failed to Accept Request",
            error
        })
    }
}
async function pendingRequest(req, res) {
    try {
        let { uid } = req.params;
        let docs = await followingModel.find({ followId: uid, isAccepted: false }).exec();
        let requests = [];
        for (let i = 0; i < docs.length; i++) {
            let uid = docs[i].uid;
            let user = await userModel.findById(uid);
            requests.push(user);
        }
        console.log(requests);
        res.json({
            message: "Successfully Got Pending Requests List",
            requests
        })
    }
    catch (error) {
        res.json({
            message: "Failed to get Pending Requests",
            error
        })
    }
}
async function deleteRequest(req, res) {
    try {
        let uid = req.params.uid;
        let { toBeDeleted } = req.body;
        let request = await followingModel.find({ followId: uid, uid: toBeDeleted, isAccepted: false }).exec();
        if (request[0] != null) {
            let deleteRequest = await followingModel.deleteOne({ followId: uid, uid: toBeDeleted, isAccepted: false });
            res.json({
                message: "Successfully Deleted Request",
                deleteRequest
            })
        } else {
            res.json({
                message: "Request Does not exist"
            })
        }
    }
    catch (error) {
        res.json({
            message: "Failed to Delete Request",
        })
    }
}
async function cancelRequest(req, res) {
    try {
        let uid = req.params.uid;
        let { toBeCanceled } = req.body;
        let doc = await followingModel.find({ uid: uid, followId: toBeCanceled, isAccepted: false }).exec();
        if (doc[0] != null) {
            let deletedRequest = await followingModel.deleteOne({ uid: uid, followId: toBeCanceled, isAccepted: false });
            res.json({
                message: "Successfully Canceled Request",
                deletedRequest
            })
        } else {
            res.json({
                message: "Request does not exist"
            })
        }
    }
    catch (error) {
        res.json({
            message: "Failed to cancel request",
            error
        })
    }
}
async function deleteFollowing(req, res) {
    try {
        let uid = req.params.uid;
        let { toBeUnfollowed } = req.body;
        let unfollowUser = await followingModel.find({ uid: uid, followId: toBeUnfollowed, isAccepted: true }).exec();

        if (unfollowUser[0] != null) {
            let unfollowedUserFromFollowing = await followingModel.deleteOne({ uid: uid, followId: toBeUnfollowed, isAccepted: true });
            let unfollowedUserFromFollower = await followerModel.deleteOne({ followerId: uid, uid: toBeUnfollowed });
            res.json({
                message: "User Unfollowed Successfully",
                unfollowedUserFromFollowing,
                unfollowedUserFromFollower
            })
        } else {
            res.json({
                message: "Following does not exist"
            })
        }
    }
    catch (error) {
        res.json({
            message: "Failed to Unfollow User",
            error
        })
    }

}
async function deleteFollower(req, res) {
    try {
        let uid = req.params.uid;
        let { toBeRemoveFollower } = req.body;
        let follower = await followingModel.find({ uid: toBeRemoveFollower, followId: uid, isAccepted: true }).exec();

        if (follower[0] != null) {
            let removeFollowerFromFollowingCollection = await followingModel.deleteOne({ uid: toBeRemoveFollower, followId: uid, isAccepted: true });
            let removeFollowerFromFollowerCollection = await followerModel.deleteOne({ uid: uid, followerId: toBeRemoveFollower });
            res.json({
                message: "Removed Follower Successfully",
                removeFollowerFromFollowingCollection,
                removeFollowerFromFollowerCollection
            })
        }
    }
    catch (error) {
        res.json({
            message: "Failed to delete Follower",
            error
        })
    }
}
async function getAllFollowing(req, res) {
    try {
        let uid = req.params.uid;
        let following = await followingModel.find({ uid: uid, isAccepted: true }).exec();
        let myFollowing = [];
        for (let i = 0; i < following.length; i++) {
            let user = await userModel.findById(following[i].followId);
            myFollowing.push(user);
        }
        if (myFollowing.length) {
            res.json({
                message: "Successfully got All Followings",
                myFollowing
            })
        } else {
            res.json({
                message: "You don't have any following list"
            })
        }
    }
    catch (error) {
        res.json({
            message: "Failed to get all following",
            error
        })
    }
}
async function getAllFollowers(req, res) {
    try {
        let uid = req.params.uid;
        let followerIds = await followerModel.find({ uid: uid }).exec();
        let myFollower = [];
        if (followerIds.length) {
            for (let i = 0; i < followerIds.length; i++) {
                let user = await userModel.findById(followerIds[i].followerId);
                myFollower.push(user);
            }
            res.json({
                message: "Successfully got All Followers",
                myFollower
            })
        } else {
            res.json({
                message: "You don't have any Followers"
            })
        }
    }
    catch (error) {
        res.json({
            message: "Failed to get All Followers",
            error
        })
    }
}
async function getFollowingHelper(uid) {
    try {
        let following = await followingModel.find({ uid: uid, isAccepted: true }).exec();
        let myFollowing = [];
        for (let i = 0; i < following.length; i++) {
            let user = await userModel.findById(following[i].followId);
            myFollowing.push(user);
        }
        return myFollowing;
    }
    catch (error) {
        return error;
    }
}
async function getSuggestions(req, res) {
    try {
        let uid = req.params.uid;
        let myFollowing = await getFollowingHelper(uid);
        let checkList = myFollowing.map(function (user) {
            return user["_id"] + "";
        });
        checkList.push(uid);

        let suggestions = [];
        for(let i = 0; i < myFollowing.length; i++){
            let followingOfMyFollowing = await getFollowingHelper(myFollowing[i]["_id"]);
            for(let j=0; j < followingOfMyFollowing.length; j++){
                if(!checkList.includes(followingOfMyFollowing[j]["_id"]  )){
                    suggestions.push(followingOfMyFollowing[j]);
                }
            }
            suggestions = suggestions.filter( user=>{
                    return user["_id"] != uid;
            })
        }

        res.json({
            message:"Successfully got All Suggestions",
            suggestions
        })

    }
    catch (error) {
        res.json({
            message: "Failed to get any Suggestions",
            error
        })
    }
}




module.exports.sendRequest = sendRequest;
module.exports.acceptRequest = acceptRequest;
module.exports.pendingRequest = pendingRequest;
module.exports.deleteRequest = deleteRequest;
module.exports.cancelRequest = cancelRequest;
module.exports.deleteFollowing = deleteFollowing;
module.exports.deleteFollower = deleteFollower;
module.exports.getAllFollowing = getAllFollowing;
module.exports.getAllFollowers = getAllFollowers;
module.exports.getSuggestions = getSuggestions;