import Parse from 'parse/react-native'

export default {
    // Project Related
        
        // Get a Project.
        // @param {string} id - The id of the project
        getProject:getProject,
        
        
        // Get a Project of a category
        // @param {string} category - The category
        getProjectsOfCategory:getProjectsOfCategory,
        
        
        // Get a Pproject backers count
        // @param {string} id - The id of the project
        getProjectBackers:getProjectBackers,
        
        
        // Get a project total pledged money
        // @param {string} id - The id of the project
        getProjectPledgedMoney:getProjectPledgedMoney,
        
    // Project Actions
        
        // Support a project with an option
        // @param {object} project - The parse object of the project
        // @param {object} option - The option object in project pledge array
        supportProjectWithOption:supportProjectWithOption,
        
        
        // Support a project with no reward
        // @param {object} project - The parse object of the project
        // @param {number} amount - The amount to support
        supportProjectNoReward:supportProjectNoReward,
        
    // Sales Related
        
        // Get a sales processed pledges list
        // @param optional {object} user - The parse user object
        // By default get the current user
        getSalesProcessedPledge:getSalesProcessedPledge,
        
        
        // Get a sales processed pledges amout
        // @param optional {object} user - The parse user object
        // By default get the current user
        getSalesTotalPledgeAmount:getSalesTotalPledgeAmount,
        
        
        // Update a Pledge to paid
        // @param {string} id - The id of the pledge
        updatePledgeToPaid:updatePledgeToPaid,
        
        
    // Users

        // User Login
        // @param userName - The user's name
        //  password - The user's password
        login:login,

        
        // Get a users reward list
        // @param optional {object} user - The parse user object
        // By default get the current user
        getUserRewards:getUserRewards,
        
        
        // Get a users pledges list
        // @param optional {object} user - The parse user object
        // By default get the current user
        // getUserPledges:getUserPledges,
        
        
        // Get a users unpaid pledges list
        // @param optional {object} user - The parse user object
        // By default get the current user
        getUserUnpaidPledges:getUserUnpaidPledges,
        
        
        // Get a users paid pledges list
        // @param optional {object} user - The parse user object
        // By default get the current user
        getUserPaidPledges:getUserPaidPledges,
        
        
        // Get a users total pledged money
        // @param optional {object} user - The parse user object
        // By default get the current user
        getUserTotalSupportedMoney:getUserTotalSupportedMoney
    
}


function getProject(id){
    let query = new Parse.Query("Project");
    return query.get(id)
}


function getProjectsOfCategory(category){
    let query = new Parse.Query("Project");
    return query.equalTo("category",category).find()
}


function getProjectBackers(id){
    let query = new Parse.Query("Pledge");
    return query.equalTo("project.objectId",id).count()
}


function getProjectPledgedMoney(id){
    let query = new Parse.Query("Pledge");
    return query.equalTo("project.objectId",id).sum();
}


function supportProjectWithOption(project,option){
    let Pledge = Parse.Object.extend("Pledge");
    let pledge = new Pledge();
    
    let ACL = new Parse.ACL();
    ACL.setRoleWriteAccess("admin", true);
    ACL.setRoleReadAccess("admin", true);
    
    ACL.setRoleWriteAccess("sales", true);
    ACL.setRoleReadAccess("sales", true);
    
    ACL.setWriteAccess(Parse.User.current());
    ACL.setReadAccess(Parse.User.current());
    
    pledge.setACL(ACL);
    pledge.set("project",project);
    pledge.set("user",Parse.User.current());
    pledge.set("amount",option.amount);
    pledge.set("status","unpaid");
    return pledge.save()
}


function supportProjectNoReward(project,amount){
    let Pledge = Parse.Object.extend("Pledge");
    let pledge = new Pledge();
    
    let ACL = new Parse.ACL();
    ACL.setRoleWriteAccess("admin", true);
    ACL.setRoleReadAccess("admin", true);
    
    ACL.setRoleWriteAccess("sales", true);
    ACL.setRoleReadAccess("sales", true);
    
    ACL.setWriteAccess(Parse.User.current());
    ACL.setReadAccess(Parse.User.current());
    
    pledge.setACL(ACL);
    pledge.set("project",project);
    pledge.set("user",Parse.User.current());
    pledge.set("amount",option.amount);
    pledge.set("status","unpaid");
    return pledge.save()
}

function getSalesProcessedPledge(user){
    user = user || Parse.User.current();
    let query = new Parse.Query("Pledge");
    return query.equalTo("processed_sales",user).find()
}

function getSalesTotalPledgeAmount(user){
    user = user || Parse.User.current();
    let query = new Parse.Query("Pledge");
    return query.equalTo("processed_sales",user).sum();
}

function updatePledgeToPaid(id){
    let query = new Parse.Query("Pledge");
    return query.get(id).then(function(pledge){
        pledge.set("status","paid");
        return pledge.save()
    })
}

function getUserRewards(user){
    user = user || Parse.User.current();
    let query = new Parse.Query("Reward");
    return query.equalTo("user",user).find()
}

function getUserPaidPledges(user){
    user = user || Parse.User.current();
    let query = new Parse.Query("Pledge");
    return query.equalTo("user",user).equalTo("status","paid").find()
}

function getUserUnpaidPledges(user){
    user = user || Parse.User.current();
    let query = new Parse.Query("Pledge");
    return query.equalTo("user",user).equalTo("status","unpaid").find()
}

function getUserTotalSupportedMoney(user){
    user = user || Parse.User.current();
    let query = new Parse.Query("Pledge");
    return query.equalTo("user",user).sum()
}

function login(userName, password) {
    return Parse.User.logIn(userName, password);
}
