﻿<?xml version="1.0"?>
<project default="release">
    <!--Copy to mu or ma-->
    <echo>[${site}] basedir:${basedir}</echo>
    <!-- Path -->
    <property name="m.release.file" value="${out.dir}/${site}.zip"/>
    <property name="site.dir" value="${basedir}/${site}"/>
    <property file="${site.dir}/gen.properties"/>
    <property name="out.m.dir" value="${out.dir}/${site}"/>
    <property name="out.m.img.dir" value="${out.m.dir}/asset/img"/>
    <property name="m.toolkit.dir" value="${toolkit.dir}/public/tmp/${site}"/>
    <echo>[${site}] out.dir:${out.dir}</echo>
    <echo>[${site}] deploy.dir:${deploy.dir}</echo>
    <echo>[${site}] out.m.dir:${out.m.dir}</echo>

    <target name="build" description="创建线上可部署的项目结构，合并js，清理调试日志等">
        <!--asset js-->
        <concat destfile="${out.m.dir}/${site}.js" encoding="${encoding}" fixlastline="on">
            <filelist files="${mf.js.file}"/>
            <filelist dir="${site.dir}" files="sitemap.js"/>
            <filelist dir="${site.dir}/asset" files="${site}.js"/>
        </concat>
        <!--asset css-->
        <concat destfile="${out.m.dir}/${site}.css" encoding="${encoding}" fixlastline="on">
            <filelist files="${mf.css.file}"/>
            <filelist dir="${site.dir}/asset" files="${site}.css"/>
        </concat>
        <!--asset tpl-->
        <concat destfile="${out.m.dir}/${site}.html" encoding="${encoding}" fixlastline="on">
            <filelist files="${mf.html.file}"/>
            <filelist dir="${site.dir}/asset" files="${site}.html"/>
        </concat>
        
        <echo>${sep}</echo>
        <echo>Distinguish Page Level Files</echo>
        <ant antfile="${site}/build-page.xml" inheritAll="true" target="buildPage"/>
        <delete file="${out.m.dir}/${site}.js"/>
        <delete file="${out.m.dir}/${site}.css"/>
        <delete file="${out.m.dir}/${site}.html"/>
        <echo>${sep}</echo>
                
        <!--other asset files-->
        <copy todir="${out.m.img.dir}" overwrite="true" force="true">
            <fileset dir="${basedir}/asset/img"/>
            <fileset dir="${site.dir}/asset/img"/>
        </copy>
        <!--entry files & 3rd file-->
        <copy todir="${out.m.dir}">
            <fileset dir="${site.dir}">
                <exclude name="asset/**"/>
                <exclude name="src/**"/>
                <exclude name="data/**"/>
                <exclude name="build.xml"/>
                <exclude name="gen.properties"/>
                <exclude name="sitemap.js"/>
            </fileset>
        </copy>

        <!--data.inc, accept fail-->
        <copy file="${site.dir}/data/${site}-data.inc" todir="${adoc.dir}" overwrite="true" force="true" failonerror="false"/>
        
        <!--add timestamp for clear catch-->
        <tstamp/>
        <replace dir="${out.m.dir}" includes="*.html" encoding="${encoding}">
            <replacefilter token="[__version__]" value="${DSTAMP}${TSTAMP}"/>
        </replace>
        
    </target>

    <target name="deploy-rmlog" depends="build" unless="enableDebugLog"
            description="删除调试日志:log/debug，保留info/warn/error">
        <replace token="console.log" value="//console.log" encoding="${encoding}" dir="${out.m.dir}/asset">
            <include name="**/*.js"/>
        </replace>
        <replace token="console.debug" value="//console.debug" encoding="${encoding}" dir="${out.m.dir}/asset">
            <include name="**/*.js"/>
        </replace>
    </target>

    <target name="deploy-min" depends="deploy-rmlog" if="enableMinimize"
            description="mobads-deploy: js、css混淆压缩、html压缩、静态资源版本控制">
        <java jar="${deploy.dir}/deploy.jar" failonerror="true" fork="true">
            <arg line="
            -yui deploy/yuicompressor.jar
            -v
            -c ${encoding}
            -r output${port}/${site}
            -ejs data
            -a html
            "/>
        </java>
    </target>

    <target name="deploy-gzip" depends="deploy-min" if="enableGzip" description="gzip">
        <echo>确认ie对gzip支持状态后执行</echo>
        <echo>线上tomcat设置Content-Encoding:gzip</echo>
    </target>

    <target name="debug" depends="deploy-gzip" description="调试环境，部署至toolkit">
    </target>

    <target name="release" depends="deploy-gzip" description="线上环境部署包">
        <zip destfile="${m.release.file}">
            <fileset dir="${out.m.dir}">
                <exclude name="data/**"/>
            </fileset>
        </zip>
    </target>
</project>