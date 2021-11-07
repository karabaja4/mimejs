# mimejs

mimejs is a small Node.js application designed to replace xdg-open on a Linux system. It discards any use of *.desktop files and instead focuses on running commands to open files.

It focuses on adding the support for:

* Extensions
* MIME Types
* Protocols (URLs)

## Configuration

Configuration is done via a single JSON configuration file. The application includes the global system configuration file with some example defaults, please edit to your liking and/or copy the configuration to your user profile, as specified on the paths below.

### System wide

```bash
/etc/mime.json
```

### Per user
```bash
$HOME/.config/mime.json
```

### Example

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

Let's analyze the sections of this configuration file.

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

Use this object to configure the command used when a specific MIME type is detected. You can use a wildcard `*` to match multiple MIME types or subtypes for every command, e.g. use `video/*` to match all video mime types, such as `video/mp4` or `video/x-matroska`.

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

## Logging

mimejs logs everything it does to:

```bash
$HOME/.local/share/mimejs/mimejs.log
```

It logs every application that it attempted to open, successful or otherwise. Useful when you need to debug which configuration entry you need to add.

## Installation

Symlink `main.js` as your `xdg-open` binary:

```bash
npm install
sudo mv "/usr/bin/xdg-open" "/usr/bin/xdg-open.bak"
sudo ln -s "${PWD}/main.js" "/usr/bin/xdg-open"
sudo cp "${PWD}/mime.json" "/etc/mime.json"
```

If you use Arch Linux, there is an AUR package: https://aur.archlinux.org/packages/mimejs-git
