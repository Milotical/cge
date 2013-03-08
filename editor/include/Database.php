<?php
class Database{
	private $server;
	private $user;
	private $password;
	private $database;
	
	private $queryCount = 0;
	
	private $log = false;
	
	private $connection;
	
	function __construct($server = "127.0.0.1", $user = "root", $password = "", $database = "") {
		$this->server = $server;
		$this->user = $user;
		$this->password = $password;
		$this->database = $database;
	}
	
	function __destruct(){
		mysql_close($this->connection);
	}
	
	public function connect(){
		$this->connection = mysql_connect($this->server, $this->user, $this->password);
		if($this->log != false){
			$this->log->logD("Connecting to " . $this->server);
		}
		
		if (!$this->connection) {
		  return false;
		  
			if($this->log != false){
				$this->log->logError("Can't connect to database server");
			}
		}else{
			if(mysql_select_db($this->database, $this->connection)){
				return true;
			}else{
				$this->log->logError("Can't connect to the database");
				return false;
			}
		}
	}
	
	public function setLog($logObj){
		$this->log = $logObj;
	}
	
	public function query($sql){
		$query = mysql_query($sql);
		
		if($this->log != false){
			$this->log->logD("Executed mysql_query: " . $sql);
			
			if(mysql_error()){
				$this->log->logD("MySQL error: " . mysql_error());
			}
		}
		
		$this->queryCount++;
		
		return $query;
	}
	
	public function getInsertId(){
		return mysql_insert_id();
	}
	
	public function getQueryCount(){
		return $this->queryCount;
	}
	
	public function escape($string){
		return mysql_real_escape_string($string);
	}
}