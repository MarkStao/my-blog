---
title: Windows常用命令
category:
  - Windows
---

Windows 操作系统是全球使用最广泛的桌面操作系统之一，其命令行工具（CMD 和 PowerShell）提供了强大的功能，能够帮助用户高效地完成各种任务。本文将列出常用的 Windows 命令，并按照功能分类提供使用示例，帮助初学者快速上手。

<!-- more -->

## 目录

1. [文件和目录相关命令](#1-文件和目录相关命令)
2. [系统信息查看命令](#2-系统信息查看命令)
3. [网络相关命令](#3-网络相关命令)
4. [进程管理命令](#4-进程管理命令)
5. [磁盘管理命令](#5-磁盘管理命令)
6. [用户和权限管理命令](#6-用户和权限管理命令)
7. [计划任务和脚本命令](#7-计划任务和脚本命令)
8. [其他常用命令](#8-其他常用命令)

---

## 1. 文件和目录相关命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **cd**            | 切换目录                            | `cd C:\Users`                           |
| **dir**           | 列出目录内容                        | `dir`                                   |
| **mkdir**         | 创建新目录                          | `mkdir NewFolder`                       |
| **rmdir**         | 删除空目录                          | `rmdir OldFolder`                       |
| **del**           | 删除文件                            | `del file.txt`                          |
| **copy**          | 复制文件                            | `copy file.txt C:\Backup`               |
| **move**          | 移动文件或重命名                    | `move file.txt C:\NewLocation`          |
| **ren**           | 重命名文件或目录                    | `ren oldname.txt newname.txt`           |
| **type**          | 显示文件内容                        | `type file.txt`                         |
| **attrib**        | 修改文件属性                        | `attrib +h file.txt`（隐藏文件）        |
| **tree**          | 以树形结构显示目录                  | `tree C:\Users`                         |
| **xcopy**         | 复制目录及其内容                    | `xcopy C:\Source C:\Destination /s`     |
| **robocopy**      | 高级文件复制工具                    | `robocopy C:\Source C:\Destination /mir`|

---

## 2. 系统信息查看命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **systeminfo**    | 显示系统详细信息                    | `systeminfo`                            |
| **hostname**      | 显示计算机名称                      | `hostname`                              |
| **ver**           | 显示 Windows 版本                   | `ver`                                   |
| **wmic**          | 查询系统信息                        | `wmic os get caption`                   |
| **tasklist**      | 显示当前运行的进程                  | `tasklist`                              |
| **taskkill**      | 终止指定进程                        | `taskkill /PID 1234`                    |
| **shutdown**      | 关机或重启                          | `shutdown /s /t 0`（立即关机）          |
| **sfc**           | 系统文件检查                        | `sfc /scannow`                          |
| **chkdsk**        | 检查磁盘错误                        | `chkdsk C: /f`                          |

---

## 3. 网络相关命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **ipconfig**      | 显示网络配置信息                    | `ipconfig`                              |
| **ping**          | 测试网络连通性                      | `ping www.google.com`                   |
| **tracert**       | 跟踪数据包路径                      | `tracert www.google.com`                |
| **netstat**       | 显示网络连接状态                    | `netstat -an`                           |
| **nslookup**      | 查询 DNS 记录                       | `nslookup www.google.com`               |
| **arp**           | 显示或修改 ARP 表                   | `arp -a`                                |
| **netsh**         | 配置网络接口                        | `netsh interface ip show config`        |
| **route**         | 显示或修改路由表                    | `route print`                           |
| **telnet**        | 远程登录工具                        | `telnet 192.168.1.1`                    |

---

## 4. 进程管理命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **tasklist**      | 列出所有进程                        | `tasklist`                              |
| **taskkill**      | 终止指定进程                        | `taskkill /PID 1234 /F`                 |
| **start**         | 启动新进程                          | `start notepad.exe`                     |
| **wmic process**  | 查询进程信息                        | `wmic process get name,processid`       |

---

## 5. 磁盘管理命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **chkdsk**        | 检查磁盘错误                        | `chkdsk C: /f`                          |
| **diskpart**      | 磁盘分区管理工具                    | `diskpart`                              |
| **format**        | 格式化磁盘                          | `format C: /fs:NTFS`                    |
| **defrag**        | 磁盘碎片整理                        | `defrag C:`                             |
| **fsutil**        | 文件系统工具                        | `fsutil file createnew test.txt 1024`   |

---

## 6. 用户和权限管理命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **net user**      | 管理用户账户                        | `net user username password /add`       |
| **net localgroup**| 管理本地用户组                      | `net localgroup administrators username /add` |
| **whoami**        | 显示当前用户                        | `whoami`                                |
| **icacls**        | 修改文件或目录权限                  | `icacls file.txt /grant username:F`     |
| **runas**         | 以其他用户身份运行程序              | `runas /user:admin cmd`                 |

---

## 7. 计划任务和脚本命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **schtasks**      | 管理计划任务                        | `schtasks /create /tn "MyTask" /tr "C:\script.bat" /sc daily` |
| **at**            | 定时执行任务                        | `at 14:00 /every:M cmd.exe`             |
| **powershell**    | 执行 PowerShell 脚本                | `powershell -File script.ps1`           |
| **cmd**           | 执行批处理文件                      | `cmd /c script.bat`                     |

---

## 8. 其他常用命令

| 命令               | 作用                                | 示例                                      |
|--------------------|-------------------------------------|------------------------------------------|
| **echo**          | 输出文本                            | `echo Hello, World!`                    |
| **cls**           | 清屏                                | `cls`                                   |
| **exit**          | 退出命令行                          | `exit`                                  |
| **set**           | 显示或设置环境变量                  | `set PATH`                              |
| **find**          | 在文件中查找字符串                  | `find "error" log.txt`                  |
| **more**          | 分页显示文件内容                    | `more file.txt`                         |
| **time**          | 显示或设置系统时间                  | `time`                                  |
| **date**          | 显示或设置系统日期                  | `date`                                  |

---

## 总结

以上列举了 Windows 系统中常用的命令，涵盖文件管理、网络、系统监控等多个方面。Windows 命令行的强大之处在于它的灵活性和多样性，尤其是在批处理脚本和自动化任务中表现出色。对于初学者来说，掌握这些命令将大大提高工作效率。加油，成为 Windows 命令行高手吧！
