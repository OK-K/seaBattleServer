﻿choose = false;

function setPlayerShips()
{
	var save = getCook('save');
	if (save == 'yes')
	{
		var nameJson = "save_" + getCook('login') + ".json";
	} else var nameJson = "new_" + getCook('login') + ".json";
	getShips=new XMLHttpRequest();
	
    getShips.open('GET','../json/' + nameJson,true);
    getShips.send();
	getShips.onreadystatechange=function() 
		{
			if (getShips.readyState==4)
				{ 
				    var jsonShip=eval( '('+getShips.responseText+')' );
					jsonMatrPlayer = jsonShip.game[0].ships;
					for (var i = 0; i < 10; i++)
					{
						for (var j = 0; j < 10; j++)
						{
							$('#' + i + '_' + j).removeClass('hereShip')
							var deck = getDeck(i + '_' + j,jsonMatrPlayer);
							if (deck == '1' || deck == '2' || deck =='3' || deck == '4')
							{
								$('#' + i + '_' + j).addClass('hereShip')
							}
							if (deck == '-1' || deck == '-2' || deck =='-3' || deck == '-4')
							{
								$('#' + i + '_' + j).addClass('hitting');
							}
							if( deck == '0')
							{
								$('#' + i + '_' + j).addClass('deadShip');
							}
							if (deck == '-5')
								$('#' + i + '_' + j).addClass('missing');
						}
					}
					
					jsonMatrPlayer = jsonShip.game[1].ships;
					for (var i = 0; i < 10; i++)
					{
						for (var j = 0; j < 10; j++)
						{
							$('#' + i + '_' + j + '_E').removeClass('hereShip')
							var deck = getDeck(i + '_' + j,jsonMatrPlayer);
							
							if (deck == '-1' || deck == '-2' || deck =='-3' || deck == '-4')
							{
								$('#' + i + '_' + j + '_E').addClass('hitting');
							}
							if( deck == '0')
							{
								$('#' + i + '_' + j + '_E').addClass('deadShip');
							}
							if (deck == '-5')
								$('#' + i + '_' + j + '_E').addClass('missing');
						}
					}
				}
		}
}
$(document).ready(function(){
	setPlayerShips();
	changeShipsRequest = "";
	countChangeShips = 0;
	choose = false;
});

function getDeck(name, inputJson)
{
	var matr = inputJson;
	var index = matr.lastIndexOf(name);
	if (index == -1)
		return '6';
	var ch = "";
	var indBegin
	for (var i = index; i < matr.length; i++)
	{
		ch = matr[i];
		if (ch === "!")
		{
			indBegin = i + 1;
			break;
		}
	}
	if (matr === "")
		return matr;
	var deck = "";
	ch = "";
	ch = matr[indBegin];
	while (ch != "!")
	{
		deck += matr[indBegin];
		indBegin++;
		ch = matr[indBegin];
	}
	return deck;
}

$('#change').on('click', function (e) {
	changeShips=new XMLHttpRequest();
	var name = getCook('login');
    changeShips.open('POST','../changeShips',true);
    changeShips.send("login=!" + name + "!");
	changeShips.onreadystatechange=function() 
		{
			if (changeShips.readyState==4)
				{ 
				    if(changeShips.responseText == '1')
					{
						setPlayerShips();
						return;
					}
				}
		}
});
$('#playGame').on('click', function (e) {
	
	
	getNewMatr();
	changeShips=new XMLHttpRequest();
	var name = getCook('login');
    changeShips.open('POST','../changeShipByPlayer',true);
    changeShips.send("login=!" + name + "!" + changeShipsRequest);
	changeShips.onreadystatechange=function() 
		{
			if (changeShips.readyState==4)
				{ 
				    if(changeShips.responseText == '1')
					{
						
					}
				}
		}
		var mode = getCook('mode');
		if (mode == 'playerwithplayer')
		{
			setInterval(function(){
				runGame=new XMLHttpRequest();
				var name = getCook('login');
				runGame.open('POST','../runGameWithPlayer',true);
				runGame.send("login=!" + name + "!");
				runGame.onreadystatechange=function() 
					{
						if (runGame.readyState==4)
							{ 
								if(runGame.responseText == '1')
								{
									document.location.href = "/pages/game.html";
								}
								
							}
					}
			},5000);
			return;
		} 
	runGame=new XMLHttpRequest();
	var name = getCook('login');
    runGame.open('POST','../runGame',true);
    runGame.send("login=!" + name + "!");
	runGame.onreadystatechange=function() 
		{
			if (runGame.readyState==4)
				{ 
				    if(runGame.responseText == '1')
					{
						document.location.href = "/pages/game.html";
					}
					
				}
		}
	
});


$('#pl > table td').on('dblclick', function () {
	if (!choose)
	{
		if (!($(this).hasClass('hereShip')))
			return;
		old_id = $(this).attr('id');
		deck_now = getDeck(old_id,changeShipsRequest);
		if (deck_now == '6')
			deck_now = getDeck(old_id,jsonMatrPlayer);
		
		if (deck_now == '1')
		{
			return;
		}
		changeOrientation();
	}
});
//событие нажатия кнопки
$('#pl > table td').on('click', function () {
	 getNewMatr();
	if (!choose)
	{
		if (!($(this).hasClass('hereShip')))
		 return;
		old_id = $(this).attr('id');
		choose = true;
		firstMove = false;
		leave_id = 0;
		previous_id = old_id;
		previous_true_id = old_id;
		orient = false;
		change_or_with_shift_right = false;
		change_or_with_shift_left = false;
		deck_now = getDeck(old_id,changeShipsRequest);
		x_new = 0;
		x_old = 0;
		if (deck_now == '5')
		{
			i++;
		}
		if (deck_now == '6')
			deck_now = getDeck(old_id,jsonMatrPlayer);
		
		if (deck_now == '1')
		{
			return;
		}
		
		else
		{
			countDifferenceExtremeCurrent = getFirstDeck(old_id,deck_now);
			return;
		}
	} else 
	{
		
		if ($('#pl > table td').hasClass('missing'))
		{
			return;
		}
		choose = false;
		change_or_with_shift_right = false;
		change_or_with_shift_left = false;
		orient = false;
		return;
	}
});


//событие наведения на клетку 
$("table td").hover(function(){
			if (!choose)
				return;
			new_id = $(this).attr('id');
			if (deck_now != '1')
			var vall = findNearBorderPoint(previous_id);
			//у верхнего края
			if (vall == 0)
			{
				getCurrentPoint(previous_id);
				x_old = currentX;
				getCurrentPoint(new_id);
				x_new = currentX;
				
				if (x_new < x_old)
				{
					//alert('КОРАБЛЬ ВЫШЕЛ ЗА КРАЙ ПОЛЯ!');
					if (orient)
					{
						if (gorizontal)
							gorizontal = false;
						else gorizontal = true;
						orient = false;
					}
					choose = false;
					first_change = true;
					setNewShip(old_id,'hereShip');
					return;
				}
			}
			
			//у нижнего края
			if (vall == 2)
			{
				getCurrentPoint(previous_id);
				x_old = currentX;
				getCurrentPoint(new_id);
				x_new = currentX;
				
				if (x_new > x_old)
				{
					//alert('КОРАБЛЬ ВЫШЕЛ ЗА КРАЙ ПОЛЯ!');
					if (orient)
					{
						if (gorizontal)
							gorizontal = false;
						else gorizontal = true;
						orient = false;
					}
					choose = false;
					first_change = true;
					setNewShip(old_id,'hereShip');
					return;
				}
			}
			
			//у левого края
			if (vall == 1)
			{
				getCurrentPoint(previous_id);
				x_old = currentY;
				getCurrentPoint(new_id);
				x_new = currentY;
				
				if (x_new < x_old)
				{
					//alert('КОРАБЛЬ ВЫШЕЛ ЗА КРАЙ ПОЛЯ!');
					if (orient)
					{
						if (gorizontal)
							gorizontal = false;
						else gorizontal = true;
						orient = false;
					}
					choose = false;
					first_change = true;
					setNewShip(old_id,'hereShip');
					return;
				}
			}
			
			//у правого края
			if (vall == 3)
			{
				getCurrentPoint(previous_id);
				x_old = currentY;
				getCurrentPoint(new_id);
				x_new = currentY;
				
				if (x_new > x_old)
				{
					//alert('КОРАБЛЬ ВЫШЕЛ ЗА КРАЙ ПОЛЯ!');
					if (orient)
					{
						if (gorizontal)
							gorizontal = false;
						else gorizontal = true;
						orient = false;
					}
					choose = false;
					first_change = true;
					setNewShip(old_id,'hereShip');
					return;
				}
			}
			
			previous_id = new_id;
			
			//countDifferenceExtremeCurrent = getFirstDeck(old_id,deck_now);
			if(leave_id != 0)
			{
				if(leave_class == 'hereShip')
					$('#' + leave_id).removeClass('hereShip');
				if(leave_class == 'missing')
					$('#' + leave_id).removeClass('missing');
				leave_id = 0;
			}
			
			if ($(this).hasClass('hereShip') || checkAllDecks($(this).attr('id'))) 
			{
				if (deck_now == '1')
				{
					$(this).addClass('missing');
					return;
				} else 
				{
					setNewShip($(this).attr('id'),'missing');
					return;
				}
			}
			
			if (deck_now == '1')
			{
				$(this).addClass('hereShip');
				test_check = true;
				
				if (!firstMove)
				{
					$('#' + old_id).removeClass('hereShip');
					firstMove = true;
				}
			} else 
			{
				setNewShip($(this).attr('id'),'hereShip');
				
				
			}
			
		}, function(){
			if (!choose)
				return;
			new_id = $(this).attr('id');
			if(change_or_with_shift_right)
			{
				getCurrentPoint($(this).attr('id'));
				new_id = currentX + '_' + (currentY + place - 1 - countDifferenceExtremeCurrent);
			}
			if (change_or_with_shift_left)
			{
				getCurrentPoint($(this).attr('id'));
				new_id = (currentX  - place + 1 + countDifferenceExtremeCurrent) + '_' + currentY;
			}
			//countDifferenceExtremeCurrent = getFirstDeck($(this).attr('id'),deck_now);
			if ($('#' + new_id).hasClass('missing')) //добавить реализацию с палубами больше 1
			{
				if (deck_now == '1')
				{
					$('#' + new_id).removeClass('missing');
					leave_id = $(this).attr('id');
					leave_class = 'missing';
					return;
				} else 
				{
					if (!gorizontal)
				{
					getCurrentPoint(new_id);
					currentX = currentX - countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('missing');
						countCurrentDeck++;
						currentX++;
						
					}
				} else 
				{
					getCurrentPoint(new_id);
					currentY = currentY + countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('missing');
						countCurrentDeck++;
						currentY--;
						
					}
				}
					return;
				}
				
			}
			if (deck_now == '1')
			{
				

					$(this).removeClass('hereShip');
					leave_id = $(this).attr('id');
					leave_class = 'hereShip';
					
			} else 
			{
				
				if (!gorizontal)
				{
					getCurrentPoint(new_id);
					currentX = currentX - countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('hereShip');
						countCurrentDeck++;
						currentX++;
						
					}
				} else 
				{
					getCurrentPoint(new_id);
					currentY = currentY + countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('hereShip');
						countCurrentDeck++;
						currentY--;
						
					}
				}
			}
			
		});


//переводим текущий выбранный id в числа
function getCurrentPoint(id)
{
	currentX = 0;
	currentY = 0;
	
	for (var i = 0; i < 10; i++)
	{
		currentX = i;
		for (var j = 0; j < 10; j++)
		{
			currentY = j;
			var str = "" + currentX + "_" + currentY;
			if (str == id)
			{
				return;
			}
		}
	}
} 
//узнаем ориентацию корабля
function getOrientation(id)
{
	x = 0;
	y  = 0;
	var checkEnd = false;
	gorizontal = false;
	for (var i = 0; i < 10; i++)
	{
		if (checkEnd)
			break;
		x = i;
		for (var j = 0; j < 10; j++)
		{
			y = j;
			var str = "" + x + "_" + y;
			if (str == id)
			{
				checkEnd = true;
				break;
			}
		}
	}
	
	if ($('#' + (x - 1) + '_' + y).hasClass('hereShip') && x != 0 || $('#' + (x + 1) + '_' + y).hasClass('hereShip'))
	{
		gorizontal = false;
		return;
	} 
	
	if ($('#' + x + '_' + (y + 1)).hasClass('hereShip') || $('#' + x + '_' + (y - 1)).hasClass('hereShip'))
	{
		gorizontal = true;
		return;
	} 
}

//узнаем количество клеток от наажатой палубы до крайней
function getFirstDeck(id,deck)
{
	getOrientation(id);
	var countDifferenceExtremeCurrent = 0;
	if (!gorizontal)
	{
		while($('#' + (x - 1) + '_' + y).hasClass('hereShip'))
		{
			x--;
			countDifferenceExtremeCurrent++;
		}
		
		
	} else 
	{
		while($('#' + x + '_' + (y + 1)).hasClass('hereShip'))
		{
			y++;
			countDifferenceExtremeCurrent++;
		}
	}
	return countDifferenceExtremeCurrent;
}

//ставим выбранный корабль в выбранное место
function setNewShip(idCurrentPoint,setClass)
{
	if(change_or_with_shift_right && !first_change)
	{
		getCurrentPoint(idCurrentPoint);
		idCurrentPoint = currentX + '_' + (currentY + place - 1 - countDifferenceExtremeCurrent);
	}
	if (change_or_with_shift_left && !first_change)
	{
		getCurrentPoint(idCurrentPoint);
		idCurrentPoint = (currentX  - place + 1 + countDifferenceExtremeCurrent) + '_' + currentY;
	}
	first_change = false;
	first_change = false;
	if (!gorizontal)
				{
					if (!firstMove)
					{
						getCurrentPoint(old_id);
						currentX = currentX - countDifferenceExtremeCurrent;
						var countCurrentDeck = 0;
						while(countCurrentDeck != deck_now)
						{
							$('#' + currentX + '_' + currentY).removeClass('hereShip');
							countCurrentDeck++;
							currentX++;
							
						}
						firstMove = true;
					}
					
					getCurrentPoint(idCurrentPoint);
					currentX = currentX - countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).addClass(setClass);
						countCurrentDeck++;
						currentX++;
						
					}
					
				} else 
				{
					if (!firstMove)
					{
						getCurrentPoint(old_id);
						currentY = currentY + countDifferenceExtremeCurrent;
						var countCurrentDeck = 0;
						while(countCurrentDeck != deck_now)
						{
							$('#' + currentX + '_' + currentY).removeClass('hereShip');
							countCurrentDeck++;
							currentY--;
							
						}
						firstMove = true;
					}
					
					getCurrentPoint(idCurrentPoint);
					currentY = currentY + countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).addClass(setClass);
						countCurrentDeck++;
						currentY--;
						
					}
					
					
				}
}

//проверка близ лежащих кораблей рядом с выбранным кораблем
function checkAllDecks(idCurrentPoint)
{
	if(change_or_with_shift_right && !first_change)
	{
		getCurrentPoint(idCurrentPoint);
		idCurrentPoint = currentX + '_' + (currentY + place - 1 - countDifferenceExtremeCurrent);
	}
	if (change_or_with_shift_left && !first_change)
	{
		getCurrentPoint(idCurrentPoint);
		idCurrentPoint = (currentX  - place + 1 + countDifferenceExtremeCurrent) + '_' + currentY;
	}
	first_change = false;
	var check = false;
	if (deck_now == '1')
	{
		getCurrentPoint(idCurrentPoint);
		
		if($('#' + currentX + '_' + currentY).hasClass('hereShip') || $('#' + (currentX-1) + '_' + currentY).hasClass('hereShip') || $('#' + (currentX+1) + '_' + currentY).hasClass('hereShip') || $('#' + currentX + '_' + (currentY-1)).hasClass('hereShip') || $('#' + currentX + '_' + (currentY+1)).hasClass('hereShip') || $('#' + (currentX -1) + '_' + (currentY - 1)).hasClass('hereShip') || $('#' + (currentX + 1) + '_' + (currentY + 1)).hasClass('hereShip') || $('#' + (currentX-1) + '_' + (currentY+1)).hasClass('hereShip') || $('#' + (currentX+1) + '_' + (currentY-1)).hasClass('hereShip'))
			{
				check = true;
				return check;
			}
		
	} else 
	if (!gorizontal)
		{
			getCurrentPoint(idCurrentPoint);
			currentX = currentX - countDifferenceExtremeCurrent;
			var countCurrentDeck = 0;
			while(countCurrentDeck != deck_now)
			{
				if($('#' + currentX + '_' + currentY).hasClass('hereShip') || $('#' + (currentX-1) + '_' + currentY).hasClass('hereShip') || $('#' + (currentX+1) + '_' + currentY).hasClass('hereShip') || $('#' + currentX + '_' + (currentY-1)).hasClass('hereShip') || $('#' + currentX + '_' + (currentY+1)).hasClass('hereShip') || $('#' + (currentX -1) + '_' + (currentY - 1)).hasClass('hereShip') || $('#' + (currentX + 1) + '_' + (currentY + 1)).hasClass('hereShip') || $('#' + (currentX-1) + '_' + (currentY+1)).hasClass('hereShip') || $('#' + (currentX+1) + '_' + (currentY-1)).hasClass('hereShip'))
				{
					check = true;
					return check;
				}
				countCurrentDeck++;
				currentX++;
						
			}
					
		} 
		else 
			{
				getCurrentPoint(idCurrentPoint);
				currentY = currentY + countDifferenceExtremeCurrent;
				var countCurrentDeck = 0;
				while(countCurrentDeck != deck_now)
				{
					if($('#' + currentX + '_' + currentY).hasClass('hereShip') || $('#' + (currentX-1) + '_' + currentY).hasClass('hereShip') || $('#' + (currentX+1) + '_' + currentY).hasClass('hereShip') || $('#' + currentX + '_' + (currentY-1)).hasClass('hereShip') || $('#' + currentX + '_' + (currentY+1)).hasClass('hereShip') || $('#' + (currentX -1) + '_' + (currentY - 1)).hasClass('hereShip') || $('#' + (currentX + 1) + '_' + (currentY + 1)).hasClass('hereShip') || $('#' + (currentX-1) + '_' + (currentY+1)).hasClass('hereShip') || $('#' + (currentX+1) + '_' + (currentY-1)).hasClass('hereShip'))
					{
						check = true;
						return check;
					}	
					countCurrentDeck++;
					currentY--;
						
				}
				
			}
			return check;
}

function checkAllDecksFromBorder(idCurrentPoint)
{
	var check = false;
	if (!gorizontal)
		{
			getCurrentPoint(idCurrentPoint);
			currentX = currentX - countDifferenceExtremeCurrent;
			var countCurrentDeck = 0;
			while(countCurrentDeck != deck_now)
			{
			if((currentX-1) < 0 || (currentX+1) > 9 || (currentY-1) < 0 || (currentY+1) > 9)
				{
					check = true;
					return check;
				}
				countCurrentDeck++;
				currentX++;
						
			}
					
		} 
		else 
			{
				getCurrentPoint(idCurrentPoint);
				currentY = currentY + countDifferenceExtremeCurrent;
				var countCurrentDeck = 0;
				while(countCurrentDeck != deck_now)
				{
					if((currentX-1) < 0 || (currentX+1) > 9 || (currentY-1) < 0 || (currentY+1) > 9)
					{
						check = true;
						return check;
					}	
					countCurrentDeck++;
					currentY--;
						
				}
				
			}
			return check;
}

//запись координат коробля в строку
function getPointsOfShip(idPoint, deck)
{
	
	var points = "";
	if (deck_now == '1')
	{
		getCurrentPoint(idPoint);
		points+= 'pX=!' + currentX + '!pY=!' + currentY + '!' + currentX + '_' + currentY + '=!' + deck + '!';
		return points;
		
		
	} else 
		//getOrientation(idPoint);
	if (!gorizontal)
		{
			getCurrentPoint(idPoint);
			currentX = currentX - countDifferenceExtremeCurrent;
			var countCurrentDeck = 0;
			while(countCurrentDeck != deck_now)
			{
				points+= 'pX=!' + currentX + '!pY=!' + currentY + '!' + currentX + '_' + currentY + '=!' + deck + '!';
				countCurrentDeck++;
				currentX++;
						
			}
					
		} 
		else 
			{
				getCurrentPoint(idPoint);
				currentY = currentY + countDifferenceExtremeCurrent;
				var countCurrentDeck = 0;
				while(countCurrentDeck != deck_now)
				{
					points+= 'pX=!' + currentX + '!pY=!' + currentY + '!' + currentX + '_' + currentY + '=!' + deck + '!';
					countCurrentDeck++;
					currentY--;
						
				}
				
			}
			return points;
}

$("table").mouseleave(function(){
	if (choose)
	{
		if (deck_now == '1')
		{
			if(leave_class == 'hereShip')
				$('#' + leave_id).addClass('hereShip');
			if(leave_class == 'missing')
				$('#' + leave_id).addClass('missing');
		}
		else 
		{
			if (orient)
			{
				if (gorizontal)
					gorizontal = false;
				else gorizontal = true;
				orient = false;
			}
			choose = false;
			first_change = true;
			setNewShip(old_id,'hereShip');
			//alert('КОРАБЛЬ ВЫШЕЛ ЗА КРАЙ ПОЛЯ!');
		}
	}
});

//узнаем, есть ли палубы рядом с границей - если есть, возвращаем 0 или 1 (i = 0 или j = 0)
function findNearBorderPoint(id)
{
	if(change_or_with_shift_right && !first_change)
	{
		getCurrentPoint(id);
		id = currentX + '_' + (currentY + place - 1 - countDifferenceExtremeCurrent);
	}
	if (change_or_with_shift_left && !first_change)
	{
		getCurrentPoint(id);
		id = (currentX  - place + 1 + countDifferenceExtremeCurrent) + '_' + currentY;
	}
	first_change = false;
	//getOrientation(id);
	if (!gorizontal)
		{
			getCurrentPoint(id);
			currentX = currentX - countDifferenceExtremeCurrent;
			var countCurrentDeck = 0;
			while(countCurrentDeck != deck_now && currentX != 0 && currentY != 0 && currentY != 9 && currentX != 10)
			{
				countCurrentDeck++;
				currentX++;	
			}		
		} 
		else 
			{
				getCurrentPoint(id);
				currentY = currentY + countDifferenceExtremeCurrent;
				var countCurrentDeck = 0;
				while(countCurrentDeck != deck_now && currentX != 0 && currentY != -1 && currentY != 9 && currentX != 9)
				{
					countCurrentDeck++;
					currentY--;
				}
			}
			if (currentX == 0)
				return 0;
			if (currentX == 10)
				return 2;
			if (currentY == -1)
				return 1;
			if (currentY == 9)
				return 3;
			else return 4;
	
}

function changeOrientation()
{
	getOrientation(old_id);
	firstMove = true;
	place = 0;
	//сейчас корабль вертикальный
	if (!gorizontal)
		{
			getCurrentPoint(old_id);
			
			
			while (place != deck_now)
			{
				place++;
				currentY--;
			}
			//если есть место слева
			if (currentY + 1 >= 0)
			{
					getCurrentPoint(old_id);
					currentX = currentX - countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('hereShip');
						countCurrentDeck++;
						currentX++;
						
					}
					gorizontal = true;
					getCurrentPoint(old_id);
					if ($('#' + old_id).hasClass('hereShip') || checkAllDecks(old_id)) 
					{
						choose = true;
						orient = true;
						setNewShip(old_id,'missing');
						return;
					} else 
					{
						setNewShip(old_id,'hereShip');
						return;
					}
			} else 
			{
				
					getCurrentPoint(old_id);
					currentX = currentX - countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('hereShip');
						countCurrentDeck++;
						currentX++;
						
					}
					getCurrentPoint(old_id);
					gorizontal = true;
					var new_y = currentY + place - 1 - countDifferenceExtremeCurrent;
					shift_id = currentX + '_' + new_y;
					if ($('#' + shift_id).hasClass('hereShip') || checkAllDecks(shift_id)) 
					{
						change_or_with_shift_right = true;
						first_change = true;
						choose = true;
						orient = true;
						setNewShip(shift_id,'missing');
						return;
					} else 
					{
						change_or_with_shift_right = false;
						first_change = false;
						setNewShip(shift_id,'hereShip');
						return;
					}
			}
		} 
		else 
			{
				getCurrentPoint(old_id);
				place = 0;
				while (place != deck_now)
				{
					place++;
					currentX--;
				}
				//если есть место сверху
			if (currentX + 1 >= 0)
			{
					getCurrentPoint(old_id);
					currentY = currentY + countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('hereShip');
						countCurrentDeck++;
						currentY--;
						
					}
					gorizontal = false;
					getCurrentPoint(old_id);
					var new_x = currentX - place + 1 + countDifferenceExtremeCurrent;
					shift_id = new_x + '_' + currentY;
					if ($('#' + shift_id).hasClass('hereShip') || checkAllDecks(shift_id)) 
					{
						change_or_with_shift_left = true;
						first_change = true;
						choose = true;
						orient = true;
						setNewShip(shift_id,'missing');
						return;
					} else 
					{
						change_or_with_shift_left = false;
						first_change = false;
						setNewShip(shift_id,'hereShip');
						return;
					}
			}else 
			{
					getCurrentPoint(old_id);
					currentY = currentY + countDifferenceExtremeCurrent;
					var countCurrentDeck = 0;
					while(countCurrentDeck != deck_now)
					{
						$('#' + currentX + '_' + currentY).removeClass('hereShip');
						countCurrentDeck++;
						currentY--;
						
					}
					getCurrentPoint(old_id);
					gorizontal = false;
					if ($('#' + old_id).hasClass('hereShip') || checkAllDecks(old_id)) 
					{
						choose = true;
						orient = true;
						setNewShip(old_id,'missing');
						return;
					} else 
					{
						setNewShip(old_id,'hereShip');
						return;
					}
			}
			}
	
}

function getNewMatr()
{
	changeShipsRequest = "";
	var deck_val = 0;
	for (var i = 0; i < 10; i++)
	{
		for (var j = 0; j < 10; j++)
		{
			if ($('#' + i + '_' + j).hasClass('hereShip'))
			{
				deck_val++;
				deck_val += getDeckFromHtml(i,j,i,j);
				changeShipsRequest += i + '_' + j + '=!' + deck_val + '!';
				deck_val = 0;
	1		} else 
			changeShipsRequest += i + '_' + j + '=!5!';
		}
	}
}

function getDeckFromHtml(i,j,x,y)
{
	var result = 0;
	ii = i;
	jj = j;
	if ($('#' + (ii + 1) + '_' + jj).hasClass('hereShip'))
	{
		while($('#' + (ii + 1) + '_' + jj).hasClass('hereShip'))
		{
			result++;
			ii++;
		}
		
	}
	if ($('#' + (x - 1) + '_' + jj).hasClass('hereShip'))
	{
		while($('#' + (x - 1) + '_' + jj).hasClass('hereShip'))
		{
			result++;
			x--;
		}
		return result;
	}
	
	if ($('#' + ii + '_' + (jj + 1)).hasClass('hereShip'))
	{
		while($('#' + ii + '_' + (jj + 1)).hasClass('hereShip'))
		{
			result++;
			jj++;
		}
		
	}
	if ($('#' + ii + '_' + (y-1)).hasClass('hereShip'))
	{
		while($('#' + ii + '_' + (y - 1)).hasClass('hereShip'))
		{
			result++;
			y--;
		}
		return result;
	}
	return result;
	}
