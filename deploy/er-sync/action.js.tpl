/**
 * @file {#ersync}
 * @author {#author}
 * @date {#date}
 * {#copyright}
 */
(function () {
    mf.{#page}.{#module}.{#action} = new er.Action({
        model: mf.{#page}.{#module}.model.{#action},
        view: 'mf_{#page}_{#module}_{#action}',
        
        onenter: function () {
            console.log('onenter');
        },
        onafterrepaint: function () {
            console.log('onafterrepaint');
        },
        onafterrender: function () {
            console.log('onafterrender');
            var action = this;
            // TODO {#ersync}
        }
    });
})();