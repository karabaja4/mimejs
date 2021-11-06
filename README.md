# mimejs

mimejs is a small Node.js application designed to replace xdg-open on a Linux system. It discards any use of *.desktop files and instead focuses on running commands to open files.

It focuses on adding the support for:

* Extensions
* MIME Types
* Protocols (URLs)

## Configuration

Configuration is done via JSON configuration file. It comes with the example defaults in the system configuration file, please edit to your liking.

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

### Variables

Use `$arg` to pass the xdg-open parameter.\
Use `$pwd` to pass the current directory path (useful for file managers).

### Extensions

Use this object to configure the command used when a specific extension is detected in the file name. Separate the extension list by a comma. Extensions have a priority over MIME types.

Example:
```json
"extensions": {
  "txt,c,cpp": "leafpad $arg",
  "avi,mkv,mp4": "vlc $arg",
  "torrent": "qbittorrent $arg",
  "pdf": "mupdf -r 96 $arg"
}
```

### MIME types

Use this object to configure the command used when a specific MIME type is detected.\
You can use a wildcard `*` to match multiple MIME types or subtypes for every command.

Example:
```json
"mimetypes": {
  "text/*": "leafpad $arg",
  "video/*": "vlc $arg",
  "media/video": "vlc $arg",
  "document/pdf": "mupdf -r 96 $arg",
  "inode/directory": "thunar $arg"
}
```
Use a `file` command to identify the MIME type of your file:
```bash
file -E --brief --mime-type file.txt
```

### Protocols

Use this object to configure the command used when a URL is detected.

Example:
```json
"protocols": {
  "http://": "chromium $arg",
  "https://": "chromium $arg",
  "slack://": "slack $arg",
  "file://": "thunar $arg"
}
```

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
