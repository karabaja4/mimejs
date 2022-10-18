# mimejs

mimejs is a small Node.js application designed to replace [xdg-open](https://wiki.archlinux.org/title/Xdg-utils#xdg-open) on a Linux system. It discards any use of *.desktop files and instead lets the user write custom commands to open files.

It supports file type detection based on:

* Extensions
* MIME Types
* Protocols (URLs)

## Configuration

Configuration is done via a `mime.json` configuration file.

A global system configuration file with some example defaults is included, which you can edit to your liking and/or copy to your user configuration folder, as specified on the paths below.

### System wide configuration path

```bash
/etc/mime.json
```

### Per user configuration path
```bash
$HOME/.config/mime.json
```

### Example configuration

```json
{
  "extensions": {
    "txt,c,cpp": "leafpad $arg",
    "avi,mkv,mp4": "vlc $arg",
    "torrent": "qbittorrent $arg",
    "pdf": "mupdf -r 96 $arg"
  },
  "mimetypes": {
    "text/*": "leafpad $arg",
    "video/*": "vlc $arg",
    "media/video": "vlc $arg",
    "document/pdf": "mupdf -r 96 $arg",
    "inode/directory": "thunar $arg"
  },
  "protocols": {
    "http://": "chromium $arg",
    "https://": "chromium $arg",
    "slack://": "slack $arg",
    "file://": "thunar $arg"
  }
}
```

Below we will analyze the individual sections of this configuration file.

### Variables

Use `$arg` to represent the parameter passed to the xdg-open command.

### Extensions

```json
"extensions": {
  "txt,c,cpp": "leafpad $arg",
  "avi,mkv,mp4": "vlc $arg",
  "torrent": "qbittorrent $arg",
  "pdf": "mupdf -r 96 $arg"
}
```

Use this object to configure the command used when a specific extension is detected in the file name. Separate the extension list by a comma. Extensions have a priority over MIME types.

### MIME types

```json
"mimetypes": {
  "text/*": "leafpad $arg",
  "video/*": "vlc $arg",
  "media/video": "vlc $arg",
  "document/pdf": "mupdf -r 96 $arg",
  "inode/directory": "thunar $arg"
}
```

Use this object to configure the command used when a specific MIME type is detected. You can use a wildcard `*` to match multiple MIME types or subtypes for every command, e.g. use `video/*` to match all video MIME types, such as `video/mp4` or `video/x-matroska`.

Use a `file` command to identify the MIME type of your file:
```bash
file -E --brief --mime-type file.txt
```

### Protocols

```json
"protocols": {
  "http://": "chromium $arg",
  "https://": "chromium $arg",
  "slack://": "slack $arg",
  "file://": "thunar $arg"
}
```

Use this object to configure the command used when a URL parameter is detected.

**Extending Protocols with specific URLs**

You can also extend the protocol key with a more specific URL, enabling you to define different commands to open different websites. For example:
```json
"protocols": {
  "https://avacyn.aerium.hr/stuff/lg3.jpg": "chromium $arg",
  "https://aws.amazon.com": "firefox $arg"
}
```
This will have an effect of all URLs starting with the specified URL to open with the specified command.

This means that in the above example, these links:
```
https://aws.amazon.com
https://aws.amazon.com/
https://aws.amazon.com/ec2/
https://aws.amazon.com/rds/
https://aws.amazon.com/rds/features/security/
```
will all match `https://aws.amazon.com` and open in Firefox.

Please be aware that the priority goes to the protocol which is defined first. This means that you should define all your specific URLs before the generic protocol entries such as `https://`.

## Logging

mimejs logs everything it does to:

```bash
$HOME/.local/share/mimejs/mimejs.log
```

It logs every application that it attempted to open, successful or otherwise. Useful when you need to debug which configuration entry you need to add.

## Installation

Symlink `main.js` as your `xdg-open` binary:

```
# mv "/usr/bin/xdg-open" "/usr/bin/xdg-open.bak"
# ln -s "${PWD}/main.js" "/usr/bin/xdg-open"
# cp "${PWD}/mime.json" "/etc/mime.json"
```

If you use Arch Linux, there is an AUR package: https://aur.archlinux.org/packages/mimejs-git
