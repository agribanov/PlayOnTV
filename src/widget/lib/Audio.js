var Audio =
{
    plugin : null
}

Audio.init = function()
{
    var success = true;
    
    this.plugin = document.getElementById("pluginAudio1");
    this.plugin.Open("Audio",1.0,"Audio");
    if (!this.plugin)
    {
        success = false;
    }

    return success;
}

Audio.setRelativeVolume = function(delta)
{
    this.plugin.Execute("SetVolumeWithKey",delta);
}

Audio.getVolume = function()
{
    alert("Volume : " +  this.plugin.Execute("GetVolume"));
    return this.plugin.Execute("GetVolume");
}
