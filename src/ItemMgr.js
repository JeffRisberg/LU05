/**
 * Subset of the real item manager.
 *
 *
 */
function ItemMgr() {

    var talentGroupHash_, itemGroupHash_;
    var itemCategories = [];

    this.getTalentGroup = function () {
       if(itemCategories.length >0){
        return itemCategories[0].items;
       }
    };
    this.getItemGroup = function () {
       if(itemCategories.length >0){
        return itemCategories[1].items;
       }
    };

    function init() {
    // Retrieve treasures list from backend/server
        Backend.getTreasures(function (list) {

            for (var idx in list) {

                var fetchedTreasures = list[idx];
                var parentId =  fetchedTreasures['parent_id']

                if(parentId != null){
                   var index =  findParent(itemCategories, parentId);
                    if (index === -1) {
                        itemCategories.push({parent: parentId, items: []});
                        index = itemCategories.length - 1;
                    }
                     itemCategories[index].items.push(fetchedTreasures);
               }

            }

        });
    }

    function findParent(arr, parent_id) {
       for (var i = 0; i < arr.length; i++) {
          var treasures = arr[i];

            if (treasures['parent'] === parent_id) {
              return(i);
            }
        }
        return(-1);
    }

    init();
}
