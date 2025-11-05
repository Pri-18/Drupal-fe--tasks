<?php

namespace Drupal\custom_twig_filters\TwigExtension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class CustomTwigExtension extends AbstractExtension {

  /**
   * Register custom Twig filters.
   */
  public function getFilters() {
    return [
      new TwigFilter('reading_time', [$this, 'getReadingTime']),
    ];
  }

  /**
   * Calculate approximate reading time.
   */
  public function getReadingTime($text) {
    $word_count = str_word_count(strip_tags($text));
    $minutes = ceil($word_count / 150);
    return $minutes . ' min read';
  }
}
