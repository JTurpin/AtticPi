<?php


class Weather {

  private $location = "80233";
  private $weather;
  private $icon;
  private $temp;
  private $response;

  public function __construct($location) {
    $this->location = $location;
  }

  public function get_temp() {
    $this->_fetch_weather();

    return $this->temp;
  }

  public function get_icon() {
    $icons = 'abcccdee..0hgglkkipooroEui..v5.6ABCBBCGGKKOO';

    $this->_fetch_weather();
    return $icons[(int)$this->icon];
  }

  private function _fetch_weather() {

    if (!empty($this->response)) { return; }

    $address = "http://rss.accuweather.com/rss/liveweather_rss.asp?metric=0&locCode=" . $this->location;

    $this->response = file_get_contents($address);
    $result = $this->parse();

    $a = explode(' ', $result->channel->item->title);
    $this->temp = rtrim(array_pop($a), 'F');

    preg_match('/icons\/(\d+)_/', $result->channel->item->description, $matches);

    $this->icon = $matches[1];
  }

  public function parse()
  {
    if( ! function_exists('simplexml_load_string'))
    {
      throw new Exception('simplexml_load_string() not found');
    }

    $xml = @simplexml_load_string($this->response);
    if( ! $xml instanceof SimpleXMLElement)
    {
      throw new Exception('Could not parse XML');
    }

    if ((isset($xml['code']) && is_numeric($xml['code'])) && 
        (isset($xml['message']) && strlen($xml['message']))) {
      throw new Exception((string)$xml['message'], (int)$xml['code']);
    }

    return $xml;
  }
}
