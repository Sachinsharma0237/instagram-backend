const { sendRequest, acceptRequest, pendingRequest, deleteRequest, cancelRequest, deleteFollowing, deleteFollower, getAllFollowing, getAllFollowers, getSuggestions } = require("../controller/requestController");
const requestRouter = require("express").Router();

requestRouter.route("")
.post(sendRequest);

requestRouter.route("/accept")
.post(acceptRequest);

requestRouter.route("/:uid")
.get(pendingRequest)
.delete(deleteRequest)
.patch(cancelRequest);

requestRouter.route("/following/:uid")
.delete(deleteFollowing)
.get(getAllFollowing);

requestRouter.route("/follower/:uid")
.delete(deleteFollower)
.get(getAllFollowers);

requestRouter.route("/suggestions/:uid")
.get(getSuggestions);


module.exports.requestRouter = requestRouter;