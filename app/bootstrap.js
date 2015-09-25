define(['models/Dataset', 'views/Option1', 'views/Option2'], function(Dataset, Option1Viz, Option2Viz){
    // TODO: this bootstrap will be removed in final component, so it is a bit ugly
    return function(){
        var opts = [document.getElementById('opt1'), document.getElementById('opt2')];
        var clickOption = function(){
            if(this.className.indexOf('selected') != -1){
                return;
            }

            opts[0].className = "option";
            opts[1].className = "option";

            this.className = 'option selected';

            var v = this.getAttribute('data-value');
            init(v == 1 ? Option1Viz : Option2Viz);
        }

        function init(clazz){
            new clazz(document.querySelector(".col.left"), Dataset).render()
            new clazz(document.querySelector(".col.right"), Dataset).render()
        }

        opts[0].addEventListener('click', clickOption, false);
        opts[1].addEventListener('click', clickOption, false);

        init(Option1Viz);
    }
})