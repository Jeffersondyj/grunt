/**
 * @file {#ersync}
 * @author {#author}
 * @date {#date}
 * {#copyright}
 */
(function () {
    mf.{#page}.{#module}.model.{#action} = new er.Model({
        LOADER_LIST: ['modelLoader'],

        modelLoader: new er.Model.Loader(function () {
            console.log('modelLoader');
            var loader = this;
            
            /*loader.stop();
            mf.get(
                '/{#page}/{#action}',
                function (model) {
                    loader.start();
                }
            );*/
        })
    });
})();