<!--asset js for {#page}-->
<echo>${out.m.dir}/asset/${site}-{#page}.js</echo>
<concat destfile="${out.m.dir}/asset/${site}-{#page}.js" encoding="${encoding}"
        fixlastline="on">
    <filelist dir="asset" files="${lib.js.file}"/>
    <filelist dir="${module.dir}" files="${{#site}sitecommonmodule.files}"/>
    <filelist dir="${module.dir}" files="${{#page}commonmodule.files}"/>
    <filelist dir="${out.m.dir}" files="${site}.js"/>
    <filelist dir="${site.dir}/asset/module" files="${{#site}siteprivatemodule.files}"/>
    <filelist dir="${site.dir}/src/{#page}/module" files="${{#page}privatemodule.files}"/>
    <filelist dir="${site.dir}/src" files="${{#page}js.files}"/>
</concat>

<!--asset css for {#page}-->
<echo>${out.m.dir}/asset/${site}-{#page}.css</echo>
<concat destfile="${out.m.dir}/asset/${site}-{#page}.css" encoding="${encoding}"
        fixlastline="on">
    <filelist dir="${out.m.dir}" files="${site}.css"/>
    <filelist dir="${site.dir}/src" files="${{#page}css.files}"/>
</concat>
<!--asset html for {#page}-->
<echo>${out.m.dir}/asset/${site}-{#page}.html</echo>
<concat destfile="${out.m.dir}/asset/${site}-{#page}.html" encoding="${encoding}"
        fixlastline="on">
    <filelist dir="${out.m.dir}" files="${site}.html"/>
    <filelist dir="${site.dir}/src" files="${{#page}tpl.files}"/>
</concat>
<replaceregexp file="${out.m.dir}/asset/${site}-{#page}.html"
               encoding="${encoding}"
               match="&gt;\s+?&lt;" replace="&gt;&lt;" flags="g m"/>