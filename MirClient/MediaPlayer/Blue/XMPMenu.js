with(XMP)
{
XMP.menu_XMPMenu = {
		initUI:function(){  //根据 DataCenter.IsFirstInit 来判断是初始化，还是换肤后恢复现场
			
			XLUIManager.Trace("XMPMenu::OnInit");
			
			var trayitem = traymanager._maintray;
  		trayitem.RegisterNotify(0x0010);
  		trayitem.RegisterNotify(0x0004);
  		trayitem.RegisterNotify(0x0002);
  		trayitem.RegisterNotify(0x0001);
  		trayitem.visible=true;
  		
  		this._UpdateSnapshotBtn();
  		this._updateMenuVideoModeStatus();
  		this._updateMenuTrackStatus(DataCenter.TrackStatus);
  		this._UpdateWindowModeMenu();
  		if(XmpPlayer.GetDisplayRatioMod() == 1)
			{
				menumanager._mainmenu._item_play._item_showscale._item_windowvedio.checked = true ;
				menumanager._mediamenu._item_showscale._item_windowvedio.checked = true ;
				menumanager._mainmenu._item_play._item_showscale._item_vediowindow.checked = false ;
				menumanager._mediamenu._item_showscale._item_vediowindow.checked = false ;
			}
			else
			{
				menumanager._mainmenu._item_play._item_showscale._item_windowvedio.checked = false ;
				menumanager._mediamenu._item_showscale._item_windowvedio.checked = false ;
				menumanager._mainmenu._item_play._item_showscale._item_vediowindow.checked = true ;
				menumanager._mediamenu._item_showscale._item_vediowindow.checked = true ;
			}
			
			XLUIManager.Trace("XMPMenu::OnInit : RecordFlag="+DataCenter.RecordFlag);
			var menuitem = menumanager._mainmenu._item_file._item_record;
			if(DataCenter.RecordFlag==0)
			{
				menuitem._item_clearatonce.checked = true;
				menuitem._item_clearatquit.checked = false;
				menuitem._item_saveatquit.checked = false;
			}
			else if(DataCenter.RecordFlag==1)
			{
				menuitem._item_clearatonce.checked = false;
				menuitem._item_clearatquit.checked = true;
				menuitem._item_saveatquit.checked = false;
			}
			else if(DataCenter.RecordFlag==2)
			{
				menuitem._item_clearatonce.checked = false;
				menuitem._item_clearatquit.checked = false;
				menuitem._item_saveatquit.checked = true;
			}
			
			if(!DataCenter.IsFirstInit)
  		{
  			for(var i=0;i<DataCenter.arrPlayRecord.length;i++)
				{
					var strFileName=DataCenter.arrPlayRecord[i];
					var lMaxFileCount = XmpPlayer.GetMaxRecentFiles();
					
					var filename=strFileName;
					var maxfilecount=lMaxFileCount;				
					var filelistmenu = menumanager._mainmenu._item_file._item_openrf;  
				  filelistmenu.LockUpdate(true);			  
				  maxfilecount += 2;
				  while(true)
				  {
				    var curcount = filelistmenu.itemcount;
				    if (curcount < maxfilecount)
				    {
				      break;
				    }
				    
				    filelistmenu.DeleteItemByIndex(curcount-1);
				  }
				  
				  if (filelistmenu.itemcount ==2)
				  {
				    filelistmenu._item_s1.visible = true;
				  }
			    			  
				  var newitem = filelistmenu.AddSimpleItem(2);
				  if (newitem != undefined )
				  {
				    newitem.text = filename;
				  }
			  
			  	filelistmenu.LockUpdate(false);
				}
  		}
		},
		saveUI:function(){  //换肤之前保存现场
		},
		_AdjustPlayRecord:function(fileIndex)
		{
			if(fileIndex >= DataCenter.arrPlayRecord.length)
			{
				return ;
			}
			
			fileIndex = DataCenter.arrPlayRecord.length - fileIndex - 1 ;
			
			XLUIManager.Trace("_AdjustPlayRecord[Start] arrPlayRecord.length="+DataCenter.arrPlayRecord.length);
			
			var temp = DataCenter.arrPlayRecord[fileIndex];
			for(var i=fileIndex;i<DataCenter.arrPlayRecord.length-1;i++)
			{
				DataCenter.arrPlayRecord[i] = DataCenter.arrPlayRecord[i+1] ;
			}
			DataCenter.arrPlayRecord[DataCenter.arrPlayRecord.length-1] = temp ;
			
			XLUIManager.Trace("_AdjustPlayRecord[End] arrPlayRecord.length="+DataCenter.arrPlayRecord.length);
		},
		AttachEvent:function(){
			// Attach Event
			//var sEvents=["onInitUI","onSaveUI","OnPopupVideoWndMenu","OnPlayStatusChanged","OnBrightSetableChange","OnMenuHotkeyChanged", "OnClearRecentFiles", "OnAddRecentFile","OnTopmostStatusChanged",
			//							"OnCtrlButtonEnableChanged","OnTabViewSelectChanged", "OnAutoShutdownStatusChanged","OnSilentStatusChanged","OnAdjustRecentFile",
			//								"OnRecordStatusChanged","OnScreenStatusChanged","OnVolumeChanged", "onCheckMainMenuPlayState"];
			var sEvents=["onInitUI","OnShowConfigWnd","onSaveUI","OnReceiveCmdLine","OnBrightSetableChange","OnPopupVideoWndMenu","OnMenuHotkeyChanged", "OnClearRecentFiles", "OnAddRecentFile","OnTopmostStatusChanged",
											"OnCtrlButtonEnableChanged","OnTabViewSelectChanged", "OnAutoShutdownStatusChanged","OnSilentStatusChanged","OnAdjustRecentFile",
											"OnRecordStatusChanged","OnScreenStatusChanged","OnOpenDVD","OnVolumeChanged","OnPlayStatusChanged", "onCheckMainMenuPlayState"];
			for(var i = 0; i<sEvents.length; i++)
			{
				var pThis=this;		 
				globalEventSource.attachEvent(this, sEvents[i] ,function(){					 
					var args =  argumentsToArray(arguments).slice(1);
					pThis.OnXMPEvent.apply(pThis, args);				 
					});			  
			}		
		},
		_UpdateSnapshotBtn:function()
		{
			if(DataCenter.CurTabName == "play" && (DataCenter.PlayStatus==5||DataCenter.PlayStatus==6) && XmpPlayer.IsSnapShotable() )
			{				
				menumanager._mainmenu._item_file.LockUpdate(true);
				menumanager._mainmenu._item_file._item_SnapshotImg1.enable = true;
				menumanager._mainmenu._item_file.LockUpdate(false);
				menumanager._mediamenu.LockUpdate(true);
				menumanager._mediamenu._item_SnapshotImg2.enable = true;
				menumanager._mediamenu.LockUpdate(false);
			}
			else
			{
				menumanager._mainmenu._item_file.LockUpdate(true);
				menumanager._mainmenu._item_file._item_SnapshotImg1.enable = false;
				menumanager._mainmenu._item_file.LockUpdate(false);
				
				menumanager._mediamenu.LockUpdate(true);
				menumanager._mediamenu._item_SnapshotImg2.enable = false;
				menumanager._mediamenu.LockUpdate(false);
			}
		},
		_showFullScreenBtn:function(bShow){
													},
		_changeTopmostStatus:function(menuitem,status){
													XLUIManager.Trace("ChangeTopmostStatus" + status);
												  if (menuitem == undefined)
												  {
												    return false;
												  }
												  XLUIManager.Trace("ChangeTopmostStatus begin ...");
												  menuitem.LockUpdate(true);
												  
												  if (status == 0)
												  {
												    menuitem._item_never.checked = true;
												    menuitem._item_whenplay.checked = false;
												    menuitem._item_always.checked  = false;
												  }
												  else if (status == 1)
												  {
												    menuitem._item_never.checked = false;
												    menuitem._item_whenplay.checked = true;
												    menuitem._item_always.checked  = false;
												  }
												  else if (status == 2)
												  {
												    menuitem._item_never.checked = false;
												    menuitem._item_whenplay.checked = false;
												    menuitem._item_always.checked  = true;
												  }
												  
												  menuitem.LockUpdate(false);
												},
		_updateMenuVideoModeStatus:function(){													
													
												},
		_updateMenuTrackStatus:function(nStatus){
			
														var mainmenu = menumanager._mainmenu;
														DataCenter.TrackStatus = nStatus ;
														if(nStatus==0)
														{
															mainmenu._item_play._item_track._item_defaulttrack.checked = true ;
															mainmenu._item_play._item_track._item_lefttrack.checked = false ;
															mainmenu._item_play._item_track._item_righttrack.checked = false ;
															menumanager._mediamenu._item_track._item_defaulttrack.checked = true ;
															menumanager._mediamenu._item_track._item_lefttrack.checked = false ;
															menumanager._mediamenu._item_track._item_righttrack.checked = false ;
														}
														else if(nStatus==1)
														{
															menumanager._mainmenu._item_play._item_track._item_defaulttrack.checked = false ;
															menumanager._mainmenu._item_play._item_track._item_lefttrack.checked = true ;
															menumanager._mainmenu._item_play._item_track._item_righttrack.checked = false ;
															menumanager._mediamenu._item_track._item_defaulttrack.checked = false ;
															menumanager._mediamenu._item_track._item_lefttrack.checked = true ;
															menumanager._mediamenu._item_track._item_righttrack.checked = false ;
														}
														else
														{
															menumanager._mainmenu._item_play._item_track._item_defaulttrack.checked =  false;
															menumanager._mainmenu._item_play._item_track._item_lefttrack.checked = false ;
															menumanager._mainmenu._item_play._item_track._item_righttrack.checked = true ;
															menumanager._mediamenu._item_track._item_defaulttrack.checked = false ;
															menumanager._mediamenu._item_track._item_lefttrack.checked = false ;
															menumanager._mediamenu._item_track._item_righttrack.checked = true ;
														}
												},
		OnXMPEvent:function(sEvent,param1,param2){
			if("onInitUI"==sEvent)
			{	
				this.initUI();
			}
			else if("OnShowConfigWnd"==sEvent)
			{
				if(DataCenter.BossStatus==false)
				{
					if(traymanager._maintray.visible)
					{
						//traymanager._maintray.visible = false;
						XmpMainWnd.Show(DataCenter.WindowTopmostCurrent,true);
				    XmpPlayer.CmdShowMainUI();
				    XmpMainWnd.BringWindowToTop();	
				  }
				  
				  XmpConfig.CheckCreateDialog();
				  
				  XmpConfigWnd.ActivateView(XmpMainWnd);
					XmpConfigWnd.Show(XmpMainWnd, true);
					XmpConfig.UpdateLayout();
				}
			}
			else if("onSaveUI"==sEvent)
			{
				this.saveUI();
			}
			else if("OnReceiveCmdLine"==sEvent)
			{
				if(param1 == 0)
				{
					DataCenter.TrayStatus = true ;						
					return;
				}
				if(traymanager._maintray.visible)
				{
					//traymanager._maintray.visible = false;
					XmpMainWnd.Show(DataCenter.WindowTopmostCurrent,true);
					DataCenter.TrayStatus = false;
		    	XmpPlayer.CmdShowMainUI();
		    	XmpMainWnd.BringWindowToTop();	
		    	
		    	if(DataCenter.TrayConfigWndVisible)
		    	{
		    		XmpConfigWnd.Show(XmpMainWnd,true);
		    	}
		    }
		    
		    if(XmpMainWnd.windowstate == 3)
		    {
		    	XmpMainWnd.Restore();
		    }
		    
		    DataCenter.BossStatus = false;
		    XmpMainWnd.BringWindowToTop();
			}
			else if("OnOpenDVD"==sEvent)
			{
				XMP.PlayControl.CtrlOpenDVD();
			}
			else if("OnPlayStatusChanged"==sEvent)
			{
				this._UpdateSnapshotBtn();
				this._UpdateWindowModeMenu();
			}
			else if("OnMenuHotkeyChanged"==sEvent)
			{
				var menuid=param1;
				var hotkey=param2;
				/*	MENU_OPEN = 0,                      // 打开文件
					MENU_OPEN_URL = 1,             // 打开URL
					MENU_FULL_SCREEN = 2,      // 全屏切换 
					MENU_PLAY_PAUSE = 3,          // 播放/暂停 
					MENU_STOP = 4,                       // 停止
					MENU_NEXT = 5,                      // 上一集
					MENU_PREV = 6,                       // 下一信
					MENU_SKIP_FRONT = 7,         // 向前跳进
					MENU_SKIP_BACK = 8,            // 向后跳进
					MENU_VOLUME_UP = 9,         // 调大音量
					MENU_VOLUME_DOWN = 10,// 调小音量
					MENU_SILENT = 11,                // 音量切换
						MENU_MINIMODE = 12,			//精简模式
					MENU_NORMALMODE = 13,		//普通模式
					*/
				switch(menuid)
				{
					case 0:
						menumanager._mainmenu._item_file._item_open.hotkey = hotkey;
						break;
					case 1:
						menumanager._mainmenu._item_file._item_openurl.hotkey = hotkey;
						break
					case 2:
						menumanager._mainmenu._item_view._item_fullscreen.hotkey = hotkey;
						menumanager._mediamenu._item_fullscreen.hotkey = hotkey;		
						break;
					case 3:
						menumanager._mainmenu._item_play._item_playpause.hotkey = hotkey;		
						menumanager._mediamenu._item_playpause.hotkey = hotkey;	
						break;
					case 4:
						menumanager._mainmenu._item_play._item_stop.hotkey = hotkey;		
						menumanager._mediamenu._item_stop.hotkey = hotkey;		
						break;	
					case 6:
						menumanager._mainmenu._item_play._item_before.hotkey = hotkey;		
						menumanager._mediamenu._item_before.hotkey = hotkey;		
						break;	
					case 5:
						menumanager._mainmenu._item_play._item_next.hotkey = hotkey;		
						menumanager._mediamenu._item_next.hotkey = hotkey;		
						break;
					case 7:
						menumanager._mainmenu._item_play._item_jumpfront.hotkey = hotkey;		
						menumanager._mediamenu._item_jumpfront.hotkey = hotkey;			
						break;	
					case 8:
						menumanager._mainmenu._item_play._item_jumpback.hotkey = hotkey;		
						menumanager._mediamenu._item_jumpback.hotkey = hotkey;		
						break;	
					case 9:
						menumanager._mainmenu._item_play._item_voiceup.hotkey = hotkey;		
						menumanager._mediamenu._item_voiceup.hotkey = hotkey;		
						break;	
					case 10:
						menumanager._mainmenu._item_play._item_voicedown.hotkey = hotkey;		
						menumanager._mediamenu._item_voicedown.hotkey = hotkey;		
						break;
					case 11:
						menumanager._mainmenu._item_play._item_slient.hotkey = hotkey;		
						menumanager._mediamenu._item_slient.hotkey = hotkey;			
						break;
					case 12:
						menumanager._mainmenu._item_view._item_minimode.hotkey = hotkey;		
						menumanager._mediamenu._item_minimode.hotkey = hotkey;
						break;
					case 13:
						menumanager._mainmenu._item_view._item_commonmode.hotkey = hotkey;		
						menumanager._mediamenu._item_commonmode.hotkey = hotkey;
						break;		
					case 14: /*Sysconfig*/
						menumanager._mainmenu._item_view._item_sysconfig.hotkey = hotkey;		
						break;
					case 15:/*snapshot*/
						menumanager._mainmenu._item_file._item_SnapshotImg1.hotkey = hotkey;		
						menumanager._mediamenu._item_SnapshotImg2.hotkey = hotkey;
						break;	
				}
			}
			else if("OnBrightSetableChange"==sEvent)
			{
				var bEnable=arguments[1];
				menumanager._mainmenu._item_play.LockUpdate(true);
				menumanager._mainmenu._item_play._item_color.enable = bEnable ;
				menumanager._mainmenu._item_play.LockUpdate(false);
				
				menumanager._mediamenu.LockUpdate(true);
				menumanager._mediamenu._item_color.enable = bEnable ;
				menumanager._mediamenu.LockUpdate(false);
			}
			else if("OnCtrlButtonEnableChanged"==sEvent)
			{
				var ctrlid=param1;
				var enable=param2;
				
				var val = true;
				if(enable == 0)
					val = false;
				if(ctrlid == 11)
				{
					this._showFullScreenBtn(val) ;					
				}
			}
			else if("OnTabViewSelectChanged"==sEvent)
			{
				this._UpdateSnapshotBtn();
				this._UpdateWindowModeMenu();
				var labelname=param1;
				 switch(labelname)
    		{
    			case "play":
    				this._showFullScreenBtn(true);
    				break;
    			case "classical":
    				this._showFullScreenBtn(false);
    				break;
    			case "theater":
    				this._showFullScreenBtn(false) ;
    				break;
    			case "search":
    				this._showFullScreenBtn(false) ;
    				break;
    			case "moviehall":
    				break;  				
    			default:
    			
    				
    		}
    		
			}
			else if("OnAutoShutdownStatusChanged"==sEvent)
			{
				var  status=param1;
				
				var item = menumanager._mainmenu._item_play._item_shutdown;
				if (typeof(item) == "undefined")
				{
					return false;
				}
			  
			 if (status == 0)
			  {
				XLUIManager.Trace("OnAutoShutdownStatusChanged() : uncheck");
			    item.checked = false;
			    item.icon="$mainmenu.shutdown_unsel";
			  }
			  else
			  {
				XLUIManager.Trace("OnAutoShutdownStatusChanged() : check");
			    item.checked = true;
			    item.icon="$mainmenu.shutdown_sel";
			  }
			}
			else if("OnSilentStatusChanged"==sEvent)
			{
				var  status=param1;
				
				var item = menumanager._mainmenu._item_play._item_slient;
			  
			  if (item != undefined)
			  {
			    if (status != 0)
			    {
			      item.checked = true;
			    }
			    else
			    {
			      item.checked = false;
			    }
			  }
			  
			  item = menumanager._mediamenu._item_slient;
			  
			  if (item != undefined)
			  {
			    if (status != 0)
			    {
			      item.checked = true;
			    }
			    else
			    {
			      item.checked = false;
			    }
			  }
			}
			else if("OnAddRecentFile"==sEvent)
			{
				var strFileName=param1;
				var lMaxFileCount = XmpPlayer.GetMaxRecentFiles();
				
				var filename=strFileName;
				var maxfilecount=lMaxFileCount;				
				var filelistmenu = menumanager._mainmenu._item_file._item_openrf;  
			  filelistmenu.LockUpdate(true);			  
			  maxfilecount += 2;
			  while(true)
			  {
			    var curcount = filelistmenu.itemcount;
			    if (curcount < maxfilecount)
			    {
			      break;
			    }
			    
			    filelistmenu.DeleteItemByIndex(curcount-1);
			  }
			  
			  if (filelistmenu.itemcount ==2)
			  {
			    filelistmenu._item_s1.visible = true;
			  }
			    
			  
			  var newitem = filelistmenu.AddSimpleItem(2);
			  if (newitem != undefined )
			  {
			    newitem.text = filename;
			    
			    DataCenter.arrPlayRecord.push(filename);
			  }
			  
			  filelistmenu.LockUpdate(false);
			}
			else if("OnTopmostStatusChanged"==sEvent)
			{
				var status=param1;
				XLUIManager.Trace("OnTopmostStatusChanged" + status);
  			var menuitem = menumanager._mainmenu._item_view._item_mostfront;
  			
  			this._changeTopmostStatus(menuitem,status);
  			menuitem = menumanager._mediamenu._item_mostfront;
  			this._changeTopmostStatus(menuitem,status);
  			
			}
			else if("OnAdjustRecentFile"==sEvent)
			{
				var fileIndex=param1;
				var filelistmenu = menumanager._mainmenu._item_file._item_openrf;
			  var curcount = filelistmenu.itemcount-2;
			  if (fileIndex >= curcount)
			  {
			    return false;
			  }
			  
			  var ret = filelistmenu.AdjustItemPosByIndex(2+fileIndex, 2);
			  this._AdjustPlayRecord(fileIndex);
			  
			}			
			else if("OnClearRecentFiles"==sEvent)
			{
				XLUIManager.Trace("CleanRecentFileList");			  
			  var filelistmenu = menumanager._mainmenu._item_file._item_openrf;			  
			  if (filelistmenu == undefined){
			    return false;
			  }			  
			  filelistmenu.LockUpdate(true);			  
			  while ( filelistmenu.itemcount >2 )
			  {
			    filelistmenu.DeleteItemByIndex(2);
			  }			    
			  filelistmenu.item_s1.visible = false;			  
			  filelistmenu.LockUpdate(false);
			  
			  DataCenter.arrPlayRecord.length = 0 ;
			}
			else if("OnRecordStatusChanged"==sEvent)
			{			
				  var nStatus=param1;
				  var menuitem = menumanager._mainmenu._item_file._item_record;
				  if (menuitem == undefined)
				  {
				    return false;
				  }				
				  
				  XLUIManager.Trace("XMPMenu::OnRecordStatusChanged = " + nStatus);
				  
				  DataCenter.RecordFlag = nStatus ;
				  
				  menuitem.LockUpdate(true);				  
				  if (nStatus == 0)
				  {
					menuitem._item_clearatonce.checked = true;
					menuitem._item_clearatquit.checked = false;
				    menuitem._item_saveatquit.checked = false; 
				  }
				  else if(nStatus == 1)
				  {
					menuitem._item_clearatonce.checked = false;
					menuitem._item_clearatquit.checked = true;
				    menuitem._item_saveatquit.checked = false; 
				  }
				  else if (nStatus == 2)
				  {
					menuitem._item_clearatonce.checked = false;
					menuitem._item_clearatquit.checked = false;
				    menuitem._item_saveatquit.checked = true; 
				  }
				  menuitem.LockUpdate(false);
			}
			else if("OnPopupVideoWndMenu"==sEvent)
			{
				var lxPos=param1;
				var lyPos=param2;
				var item = menumanager._mediamenu;
			  if (item == undefined)
			  {
			    return false;
			  }
			  
			   var bEnable;
			  if (DataCenter.PlayStatus ==1 || DataCenter.PlayStatus == 3)
			  {
			    bEnable = false;
			  }
			  else
			  {
			    bEnable = true;
			  }
			  
			  var mediamenu = menumanager._mediamenu;
			  if (mediamenu != undefined)
			  {
			    mediamenu.LockUpdate(true);
			  
			    mediamenu._item_playpause.enable = bEnable;
			    mediamenu._item_stop.enable = bEnable;
			    mediamenu._item_before.enable = bEnable;
			    mediamenu._item_next.enable = bEnable;
			    mediamenu._item_jumpfront.enable = bEnable;
			    mediamenu._item_jumpback.enable = bEnable;
			    mediamenu._item_mediainfo.enable = bEnable;
			    
			    mediamenu.LockUpdate(false);
			  }
			  		  
			  this._UpdateSubtitleStatus();
			  return item.SimpleTrackPopupMenu(lxPos, lyPos);
			}
			else if("OnScreenStatusChanged"==sEvent)
			{
				this._UpdateWindowModeMenu();
				this._updateMenuVideoModeStatus();
			}
			else if("OnVolumeChanged"==sEvent)
			{
				var nVolume=param1;
				XLUIManager.Trace(nVolume);
				if(nVolume==-3) // slience
				{
					if(menumanager._mediamenu._item_slient.checked){
						menumanager._mainmenu._item_play._item_slient.checked = false ;
						menumanager._mediamenu._item_slient.checked = false ;
					}
					else{
						menumanager._mainmenu._item_play._item_slient.checked = true ;
						menumanager._mediamenu._item_slient.checked = true ;
					}
				}
				
			}
			else if("onCheckMainMenuPlayState"==sEvent)
			{
				XLUIManager.Trace("onCheckMainMenuPlayState::Menu");
				this._UpdateSubtitleStatus();
				this._UpdateDVDStatus();
				 var bEnable;
			  if (DataCenter.PlayStatus==2 || DataCenter.PlayStatus == 5 || DataCenter.PlayStatus == 6)
			  {
			    bEnable = true;
			  }
			  else
			  {
			    bEnable = false;
			  }
			  
			  var mainmenu = menumanager._mainmenu;
			  var filemenu = mainmenu._item_file;
			  if (filemenu != undefined)
			  {
			    filemenu.LockUpdate(true);
			    
			    filemenu._item_close.enable = bEnable;
			    filemenu._item_mediainfo.enable = bEnable;
			    
			    filemenu.LockUpdate(false);
			  }
			  
			  var playmenu = mainmenu._item_play;
			  if (playmenu != undefined)
			  {
			    playmenu.LockUpdate(true);
			    
			    playmenu._item_playpause.enable = bEnable;
			    playmenu._item_stop.enable = bEnable;
			    playmenu._item_before.enable = bEnable;
			    playmenu._item_next.enable = bEnable;
			    playmenu._item_jumpfront.enable = bEnable;
			    playmenu._item_jumpback.enable = bEnable;
			
			    playmenu.LockUpdate(false);
			  }
			}
		},
		_UpdateDVDStatus:function()
		{
			DataCenter.DVDDriver = XmpPlayer.GetMediaInDVDDrivers();
		  
		  var item = menumanager._mainmenu._item_file._item_openDVD;
		  if (typeof(item) == "undefined")
		  {
			return false;
		  }
		  if(DataCenter.DVDDriver != "")
		  {
		  	menumanager._mainmenu._item_file.LockUpdate(true);
				item.enable = true;
				menumanager._mainmenu._item_file.LockUpdate(false);
		  }
		  else
		  {
		  	menumanager._mainmenu._item_file.LockUpdate(true);
				item.enable = false;
				menumanager._mainmenu._item_file.LockUpdate(false);
		  }
		},
		_UpdateWindowModeMenu:function()
		{
			var bCanSwitch = false ;
			if(DataCenter.CurTabName == "play")
			{
				if((DataCenter.PlayStatus == 3 || DataCenter.PlayStatus == 5 || DataCenter.PlayStatus == 6))
				{
					bCanSwitch = true;
				}
			}
			else if(btnTabMovieHall.checked == true)
			{
				if(XmpPlayer.IsMoviehallInPlayingMode())	
				{
					bCanSwitch= true;
				}
			}
			
			if(!bCanSwitch)
			{
				// 全部Disable
				menumanager._mainmenu._item_view.LockUpdate(true);
				menumanager._mainmenu._item_view._item_fullscreen.enable = false;						
				menumanager._mainmenu._item_view._item_commonmode.enable = false;				
				menumanager._mainmenu._item_view._item_minimode.enable = false;				
				menumanager._mainmenu._item_view.LockUpdate(false);
				
				menumanager._mediamenu.LockUpdate(true);
				menumanager._mediamenu._item_fullscreen.enable = false;
				menumanager._mediamenu._item_commonmode.enable = false;	
				menumanager._mediamenu._item_minimode.enable = false;	
				menumanager._mediamenu.LockUpdate(false);
				
				menumanager._mainmenu._item_view._item_fullscreen.checked = false;
				menumanager._mediamenu._item_fullscreen.checked = false;		
				menumanager._mainmenu._item_view._item_commonmode.checked = true;
				menumanager._mediamenu._item_commonmode.checked = true;	
				menumanager._mainmenu._item_view._item_minimode.checked = false;
				menumanager._mediamenu._item_minimode.checked = false;	
			}
			else
			{
				if(DataCenter.WindowMode==0)
				{
					menumanager._mainmenu._item_view.LockUpdate(true);
					menumanager._mainmenu._item_view._item_fullscreen.enable = true;						
					menumanager._mainmenu._item_view._item_commonmode.enable = false;						
					menumanager._mainmenu._item_view._item_minimode.enable = true;						
					menumanager._mainmenu._item_view.LockUpdate(false);
					
					menumanager._mediamenu.LockUpdate(true);
					menumanager._mediamenu._item_fullscreen.enable = true;
					menumanager._mediamenu._item_commonmode.enable = false;	
					menumanager._mediamenu._item_minimode.enable = true;
					menumanager._mediamenu.LockUpdate(false);
					
					menumanager._mainmenu._item_view._item_fullscreen.checked = false;
					menumanager._mediamenu._item_fullscreen.checked = false;		
					menumanager._mainmenu._item_view._item_commonmode.checked = true;
					menumanager._mediamenu._item_commonmode.checked = true;	
					menumanager._mainmenu._item_view._item_minimode.checked = false;
					menumanager._mediamenu._item_minimode.checked = false;
				}
				else if(DataCenter.WindowMode==1)
				{
					menumanager._mainmenu._item_view.LockUpdate(true);
					menumanager._mainmenu._item_view._item_fullscreen.enable = false;					
					menumanager._mainmenu._item_view._item_commonmode.enable = true;						
					menumanager._mainmenu._item_view._item_minimode.enable = true;					
					menumanager._mainmenu._item_view.LockUpdate(false);
					
					menumanager._mediamenu.LockUpdate(true);
					menumanager._mediamenu._item_fullscreen.enable = false;		
					menumanager._mediamenu._item_commonmode.enable = true;
					menumanager._mediamenu._item_minimode.enable = true;
					menumanager._mediamenu.LockUpdate(false);
					
					menumanager._mainmenu._item_view._item_fullscreen.checked = true;
					menumanager._mediamenu._item_fullscreen.checked = true;		
					menumanager._mainmenu._item_view._item_commonmode.checked = false;
					menumanager._mediamenu._item_commonmode.checked = false;	
					menumanager._mainmenu._item_view._item_minimode.checked = false;
					menumanager._mediamenu._item_minimode.checked = false;
				}
				else if(DataCenter.WindowMode==2)
				{
					menumanager._mainmenu._item_view.LockUpdate(true);
					menumanager._mainmenu._item_view._item_fullscreen.enable = true;
					menumanager._mainmenu._item_view._item_commonmode.enable = true;
					menumanager._mainmenu._item_view._item_minimode.enable = false;
					menumanager._mainmenu._item_view.LockUpdate(false);
					
					menumanager._mediamenu.LockUpdate(true);
					menumanager._mediamenu._item_fullscreen.enable = true;	
					menumanager._mediamenu._item_commonmode.enable = true;	
					menumanager._mediamenu._item_minimode.enable = false;
					menumanager._mediamenu.LockUpdate(false);
					
					
					menumanager._mainmenu._item_view._item_fullscreen.checked = false;
					menumanager._mediamenu._item_fullscreen.checked = false;		
					menumanager._mainmenu._item_view._item_commonmode.checked = false;
					menumanager._mediamenu._item_commonmode.checked = false;	
					menumanager._mainmenu._item_view._item_minimode.checked = true;
					menumanager._mediamenu._item_minimode.checked = true;
				}
			}
		},
		_HidePopupMenu:function(){
			menumanager._mediamenu.visible=0;
		},
		_UpdateSubtitleStatus:function(){
			XLUIManager.Trace("onCheckMainMenuPlayState::Menu2");
			var submenu1 = menumanager._mainmenu._item_play._item_subtitle ;
			var submenu2 = menumanager._mediamenu._item_subtitle ;
			
			// 清空数据
			var langmenu = submenu1._item_subtitle_lang ;  
			while ( langmenu.itemcount >0 )
			{
			  langmenu.DeleteItemByIndex(0);
			}			    	  
			
			langmenu = submenu2._item_subtitle_lang ;		  
			while ( langmenu.itemcount >0 )
			{
			  langmenu.DeleteItemByIndex(0);
			}			    	  
			
			var filemenu = submenu1._item_subtitle_file ;
			while ( filemenu.itemcount >4 )
			{
			  filemenu.DeleteItemByIndex(0);
			}		
			filemenu._item_sep_subtitlefile.visible = false;	 
			
			filemenu = submenu2._item_subtitle_file ;
			while ( filemenu.itemcount >4 )
			{
			  filemenu.DeleteItemByIndex(0);
			}		
			filemenu._item_sep_subtitlefile.visible = false;	  
			
			submenu1._item_subtitle_file._item_subtitle_no.checked = 0 ;
			submenu2._item_subtitle_file._item_subtitle_no.checked = 0 ;
			submenu1._item_subtitle_file._item_subtitle_manual.checked = 0 ;
			submenu2._item_subtitle_file._item_subtitle_manual.checked = 0 ; 	
			submenu1._item_subtitle_file._item_subtitle_manual.enable = 0 ;
			submenu2._item_subtitle_file._item_subtitle_manual.enable = 0 ; 	    
			  
			// 字幕文件
			var nFileSelected = XmpPlayer.GetSubtitleSelect();
			XLUIManager.Trace("SubtitleFile::Selected = "+nFileSelected);
			if(nFileSelected==-1) // 无字幕
			{
				submenu1._item_subtitle_file._item_subtitle_no.checked = 1 ;
				submenu2._item_subtitle_file._item_subtitle_no.checked = 1 ;
			}
			else if(nFileSelected==-2) // 手动加载
			{
				submenu1._item_subtitle_file._item_subtitle_manual.checked = 1 ;
				submenu2._item_subtitle_file._item_subtitle_manual.checked = 1 ;
				submenu1._item_subtitle_file._item_subtitle_manual.enable = 1 ;
				submenu2._item_subtitle_file._item_subtitle_manual.enable = 1 ;
			}
				
			var nFileCount = XmpPlayer.GetSubtitleCount();
			XLUIManager.Trace("SubtitleFile::Count = "+nFileCount);
			if(nFileCount>0)
			{				
				submenu1._item_subtitle_file._item_sep_subtitlefile.visible=true;
				submenu2._item_subtitle_file._item_sep_subtitlefile.visible=true;
				for(var i=0;i<nFileCount;i++)
				{
					var sFileName = XmpPlayer.GetSubtitleName(i);
					XLUIManager.Trace("SubtitleFile::Name["+i+"] = "+sFileName);
					var newitem = submenu1._item_subtitle_file.AddSimpleItem(i);
				  if (newitem != undefined )
				  {
				    newitem.text = sFileName;
				    
				    if(nFileSelected==i) newitem.checked = 1 ;
				    else newitem.checked = 0 ;
					}
					
					newitem = submenu2._item_subtitle_file.AddSimpleItem(i);
				  if (newitem != undefined )
				  {
				    newitem.text = sFileName;
				    
				    if(nFileSelected==i) newitem.checked = 1 ;
				    else newitem.checked = 0 ;
					}
				}
			}
			
			// 字幕语言
			var nLangCount = XmpPlayer.GetSubtitleLangCount();
			if(nLangCount<=0)
			{
				submenu1._item_subtitle_lang.enable=false;
				submenu2._item_subtitle_lang.enable=false;
			}
			else
			{
				var nLangSelected = XmpPlayer.GetSubtitleLangSelect();
				submenu1._item_subtitle_lang.enable=true;
				submenu2._item_subtitle_lang.enable=true;
				for(var i=0;i<nLangCount;i++)
				{
					var sLangName = XmpPlayer.GetSubtitleLangName(i);
					var newitem = submenu1._item_subtitle_lang.AddSimpleItem(i);
				  if (newitem != undefined )
				  {
				    newitem.text = sLangName;
				    
				    if(nLangSelected==i) newitem.checked = 1 ;
				    else newitem.checked = 0 ;
					}
					
					newitem = submenu2._item_subtitle_lang.AddSimpleItem(i);
				  if (newitem != undefined )
				  {
				    newitem.text = sLangName;
				    
				    if(nLangSelected==i) newitem.checked = 1 ;
				    else newitem.checked = 0 ;
					}
				}
			}
		},
		//菜单响应函数
		OnMainMenuCmd:function(object, wparam, lparam)
		{
			object.enable = false;
		},
		OnFaceMgrMenuCmd:function(object, wparam, lparam)
		{
			var id = object.id;

			if (id == "item_themeface")
			{
				DataCenter.SkinMgrWnd=XLUIManager.ToggleChangeSkin(false);     															
				XmpSkinMgrHost.DoModal(XmpMainWnd);
			}
			else if(id == "item_palette")
			{
				XLUIManager.ToggleAdjustPalette(XmpMainWnd,XmpMainWnd.width/2-120 + XmpMainWnd.left,XmpMainWnd.height/2-80 + XmpMainWnd.top);
			}
		},
		OnMenuFile:function(object, wparam, lparam)
		{
			var id = object.id;
  
		  // 打开文件
		  if (id == "item_open")
		  { 
		    //XmpPlayer.CmdOpen();
		    XMP.PlayControl.CtrlOpen();
		  }
		  else if(id == "item_openDVD")
		  {
		  	XMP.PlayControl.CtrlOpenDVD();
				//XmpPlayer.OpenDVDMedia(DataCenter.DVDDriver);
		  }
		  // 打开URL
		  else if (id == "item_openurl")
		  {
		    XmpPlayer.CmdOpenUrl();
		  }
		  // 关闭当前正在播放的文件
		  else if (id == "item_close")
		  {
		    XmpPlayer.CmdClose();
		  }
		  // 当前文件的媒体信息
		  else if (id == "item_mediainfo")
		  {
		    XmpPlayer.CmdMediaInfo();
		  }
		  else if(id == "item_SnapshotImg1")
		  {
		  	XmpPlayer.SnapshotImg(1);
		  }
		  else if(id == "item_SnapshotImg2")
		  {
		  	XmpPlayer.SnapshotImg(2);
		  }
		},
		OnMenuRecentFile:function(object, wparam, lparam)
		{
			var menuitemid = object.id;
		  if (menuitemid == "item_clear" )
		  {
		    XmpPlayer.CmdClearRecentFiles();
		  }
		  else
		  {
		    var parent = object.parent;
		    var nIndex = parent.GetItemIndex(object.id);
		    if (nIndex >=2 )
		    {
		      XmpPlayer.CmdRecentFile(nIndex-2);
		    }
		  }
		},
		OnMenuPlayRecord:function(object, wparam, lparam)
		{
			var id = object.id;
		  XLUIManager.Trace("OnMenuPlayRecord(): " + id);
		  
		  var menuitem = menumanager._mainmenu._item_file._item_record;
		  if (menuitem == undefined)
		  {
		    return false;
		  }
		  
		  XLUIManager.Trace("XMPMenu::OnRecordStatusChanged = " + id);
		  
		  if (id == "item_clearatonce")
		  {		  	
		//		menuitem._item_clearatonce.checked = true;
		//		menuitem._item_clearatquit.checked = false;
		//    menuitem._item_saveatquit.checked = false; 
		//    DataCenter.RecordFlag=0;
		    XmpPlayer.CmdClearRecord();
		  }
		  else if(id == "item_clearatquit")
		  {
		//		menuitem._item_clearatonce.checked = false;
		//		menuitem._item_clearatquit.checked = true;
		//    menuitem._item_saveatquit.checked = false;
		//    DataCenter.RecordFlag=1; 
		    XmpPlayer.CmdQuitClearRecord();
		  }
		  else if (id == "item_saveatquit")
		  {
		//		menuitem._item_clearatonce.checked = false;
		//		menuitem._item_clearatquit.checked = false;
		//    menuitem._item_saveatquit.checked = true; 
		//    DataCenter.RecordFlag=2;
		    XmpPlayer.CmdQuitSaveRecord();
		  }
		},
		OnMenuQuit:function(object, wparam, lparam)
		{
			//Quit();
			//ASSERT(0);
			XMP.view_XmpMainWnd.Quit();
		},
		OnMenuView:function(object, wparam, lparam)
		{
			//this._HidePopupMenu();
			
			var id = object.id;
  
		  if (id == "item_fullscreen")
		  {
		  	XMP.WindowMode.ChangeWindowMode(1);
		  }
		  else if (id == "item_sysconfig")
		  {
		  	if(traymanager._maintray.visible)
				{
					//traymanager._maintray.visible = false;
					XmpMainWnd.Show(DataCenter.WindowTopmostCurrent,true);
			    XmpPlayer.CmdShowMainUI();
			    XmpMainWnd.BringWindowToTop();	
			  }
			  
			  XmpConfig.CheckCreateDialog();
			  
			  XmpConfigWnd.ActivateView(XmpMainWnd);
				XmpConfigWnd.Show(XmpMainWnd, true);
				XmpConfig.UpdateLayout();
								
				//XmpConfigWnd.Show(XmpMainWnd, true);
		 }
		 else if (id == "item_commonmode")
		  {
			  XMP.WindowMode.ChangeWindowMode(0);
		 }
		 else if (id == "item_minimode")
		  {
		    XMP.WindowMode.ChangeWindowMode(2);
		 }
		 
		 
		},
		OnMenuHelp:function(object, wparam, lparam)
		{
			var id = object.id;
  
		  if (id == "item_feedback")
		  {
		    XmpPlayer.CmdHelp();
		  }
		  else if (id == "item_xunleionline")
		  {
		    XmpPlayer.CmdXLOnline();
		  }
		  else if (id == "item_update")
		  {
		    XmpPlayer.CmdCheckUpdate();
		  }
		  else if (id == "item_about")
		  {
				AboutMsgBox_AppVersion.text =  XmpPlayer.GetAppVersion();
				AboutMsgBox_APlayerVersion.text = XmpPlayer.GetAplayerVersion();
				AboutMsgBox.DoModal(XmpMainWnd);
		  }
		},
		OnMediaMenuCmd:function(object, wparam, lparam)
		{
		},
		OnMostFrontMenuCmd:function(object, wparam, lparam)
		{
			var id = object.id;
  
		  if (id == "item_never")
		  {
		    XMP.WindowStatus.ChangeWindowStatus(0) ;
		  }
		  else if (id == "item_whenplay")
		  {
		    XMP.WindowStatus.ChangeWindowStatus(1) ;
		  }
		  else if (id == "item_always")
		  {
		    XMP.WindowStatus.ChangeWindowStatus(2) ;
		  }
		},
		OnPlayMenuCmd:function(object, wparam, lparam)
		{
			  var id = object.id;
			  if (id == "item_playpause")
			  {
			    XmpPlayer.CmdPlayPause();
			  }
			  else if (id == "item_stop")
			  {
			    XmpPlayer.CmdStop();
			  }
			  else if (id == "item_before")
			  {
			    XmpPlayer.CmdPrev();
			  }
			  else if (id == "item_next")
			  {
			    XmpPlayer.CmdNext();
			  }
			  else if (id == "item_jumpfront")
			  {
			    XmpPlayer.CmdSkipFront();
			  }
			  else if (id == "item_jumpback")
			  {
			    XmpPlayer.CmdSkipBack();
			  }
			  else if (id == "item_voiceup")
			  {
			    XMP.PlayControl.CtrlVolumeUp();
			  }
			  else if (id == "item_voicedown")
			  {
			    XMP.PlayControl.CtrlVolumeDown();
			  }
			  else if (id == "item_slient")
			  {
				 if(object.checked)
				  {
					 	XMP.PlayControl.CtrlSilence();
				  }
				  else
				  {
					  XMP.PlayControl.CtrlSound();	  
				  }
			  }
			  else if (id == "item_shutdown")
			  {
			    XmpPlayer.CmdAutoShutdown(object.checked);
			  }
			  else if (id == "item_color")
			  {
			  	XmpConfig.CheckCreateDialog();
			    XmpConfig.SelectTabView("Color")
					cfTabColor.checked = true
					XmpConfigWnd.Show(XmpMainWnd, true);
					XmpConfigWnd.ActivateView(XmpMainWnd);
					XmpConfig.UpdateLayout();
			  }
			  else if (id == "item_speed")
			  {
			  	XmpConfig.CheckCreateDialog();
			    XmpConfig.SelectTabView("Speed")		
					cfTabSpeed.checked = true
					XmpConfigWnd.Show(XmpMainWnd, true);
					XmpConfigWnd.ActivateView(XmpMainWnd);
					XmpConfig.UpdateLayout();
			  }
		},
		OnScaleMenuCmd:function(object, wparam, lparam)
		{
			var id = object.id;

			if (id == "item_windowvedio")
			{
				XmpPlayer.SetDisplayRatioMod(1);
		
					menumanager._mainmenu._item_play._item_showscale._item_windowvedio.checked = true ;
					menumanager._mediamenu._item_showscale._item_windowvedio.checked = true ;
					menumanager._mainmenu._item_play._item_showscale._item_vediowindow.checked = false ;
					menumanager._mediamenu._item_showscale._item_vediowindow.checked = false ;
					
					XMP.globalEventSource.fireEvent("onDisplayRatioModChange",1);
					
			/*	if(XmpPlayer.GetDisplayRatioMod()==0)
				{
					XmpPlayer.SetDisplayRatioMod(1);
		
					menumanager._mainmenu._item_play._item_showscale._item_windowvedio.checked = true ;
					menumanager._mediamenu._item_showscale._item_windowvedio.checked = true ;
					menumanager._mainmenu._item_play._item_showscale._item_vediowindow.checked = false ;
					menumanager._mediamenu._item_showscale._item_vediowindow.checked = false ;
					
					if ( 5 == DataCenter.PlayStatus)
					{
						DataCenter.ShouldChangeWnd = true;
						XMP.globalEventSource.fireEvent("OnPlayStatusChanged",DataCenter.PlayStatus);						
					}
				}*/
			}
			else if(id == "item_vediowindow")
			{
				XmpPlayer.SetDisplayRatioMod(0);
		
					menumanager._mainmenu._item_play._item_showscale._item_windowvedio.checked = false ;
					menumanager._mediamenu._item_showscale._item_windowvedio.checked = false ;
					menumanager._mainmenu._item_play._item_showscale._item_vediowindow.checked = true ;
					menumanager._mediamenu._item_showscale._item_vediowindow.checked = true ;
					
					XMP.globalEventSource.fireEvent("onDisplayRatioModChange",0);
					
			/*	if(XmpPlayer.GetDisplayRatioMod()==1)
				{
					XmpPlayer.SetDisplayRatioMod(0);
		
					menumanager._mainmenu._item_play._item_showscale._item_windowvedio.checked = false ;
					menumanager._mediamenu._item_showscale._item_windowvedio.checked = false ;
					menumanager._mainmenu._item_play._item_showscale._item_vediowindow.checked = true ;
					menumanager._mediamenu._item_showscale._item_vediowindow.checked = true ;
				}*/
			}
			
		},
		OnTrackMenuCmd:function(object, wparam, lparam)
		{
			var id = object.id;

			if (id == "item_defaulttrack")
			{
				XmpPlayer.SetAudioBalance(50);
				this._updateMenuTrackStatus(0);
			}
			else if(id == "item_lefttrack")
			{
				XmpPlayer.SetAudioBalance(0);
				this._updateMenuTrackStatus(1);
			}
			else if(id == "item_righttrack")
			{
				XmpPlayer.SetAudioBalance(100);
				this._updateMenuTrackStatus(2);
			}
		},
		OnTrayMenuCmd:function(object, wparam, lparam)
		{
			var id = object.id;
  
		  if (id == "item_open")
		  {
		  	XLUIManager.Trace("OnTrayMenuCmd::Open TrayConfigWndVisible="+DataCenter.TrayConfigWndVisible);
		  	//traymanager._maintray.visible = false;
		  	
		  	if(DataCenter.TrayStatus)
		  	{
		  		XmpMainWnd.Show(DataCenter.WindowTopmostCurrent,true);
			    XmpPlayer.CmdShowMainUI();
			    XmpMainWnd.BringWindowToTop();	
			    
			    if(DataCenter.TrayConfigWndVisible)
			    {
			    	XmpConfigWnd.Show(XmpMainWnd,true);
			    }
		  	}
		  	else
		  	{
			  	if(DataCenter.PlayStatus==5/*Playing*/)
					{
						XMP.PlayControl.CtrlPause();
					}
					DataCenter.TrayConfigWndVisible = XmpConfigWnd.visible ;
					XmpMainWnd.Hide();
					XmpConfigWnd.Hide();
		  	}
		    
		    DataCenter.TrayStatus=!DataCenter.TrayStatus;
		  }
		  else if(id == "item_browse")
		  {
		  	XmpPlayer.CmdXLOnline();
		  }
		},
		OnSubtitleCmd:function(object, wparam, lparam)
		{
			var id = object.id;
			if (id == "item_subtitle_load")
		  {
		  	XmpPlayer.CmdLoadSubtitle();
		  }
		  else if (id == "item_subtitle_setting")
		  {
		  	XmpConfig.CheckCreateDialog();
			  XmpConfig.SelectTabView("Subtitle");
			  cfTabSubtitle.checked = true;
				XmpConfigWnd.Show(XmpMainWnd, true);
				XmpConfigWnd.ActivateView(XmpMainWnd);
				XmpConfig.UpdateLayout();
		  }
		},
		OnSubtitleFile:function(object, wparam, lparam)
		{
			var submenu = menumanager._mainmenu._item_play._item_subtitle ;
			var parent = object.parent;
		  var nIndex = parent.GetItemIndex(object.id);
		  
		  var count = submenu._item_subtitle_file.itemcount ;
		  if(nIndex<count-4)
		  {
		  	XmpPlayer.SetSubtitleSelect(nIndex);
		  }
		  else if(nIndex==count-3)
		  {
		  	XmpPlayer.SetSubtitleSelect(-1);
		  }	
		  
		},
		OnSubtitleLang:function(object, wparam, lparam)
		{
			var parent = object.parent;
		  var nIndex = parent.GetItemIndex(object.id);
		  
		  XmpPlayer.SetSubtitleLangSelect(nIndex);
		}
	};
	
	menu_XMPMenu.AttachEvent();
}